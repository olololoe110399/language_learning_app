import logging
from typing import Dict, Any, List
from google.genai import types

from app.services.gemini_service import gemini_service
from app.models.grammar import GrammarResponse, GrammarTopic, GrammarExample

# Configure logger
logger = logging.getLogger(__name__)


class GrammarService:
    """Service for generating grammar lessons"""

    async def generate_grammar_lesson(self, source_language: str, target_language: str, purpose: str) -> GrammarResponse:
        """
        Generate a grammar lesson based on the provided context

        Args:
            source_language: User's source language
            target_language: Target language to learn
            purpose: Context or purpose for learning

        Returns:
            GrammarResponse with relevant grammar topics
        """
        try:
            # Define the function declaration for Gemini API
            function_declarations: List[types.FunctionDeclaration] = [
                types.FunctionDeclaration(
                    name="generate_grammar_lesson",
                    description="Generate grammar topics and examples for a specific language learning context",
                    parameters=types.Schema(
                        type=types.Type.OBJECT,
                        properties={
                            "relevantGrammar":  types.Schema(
                                type=types.Type.ARRAY,
                                description="List of grammar topics relevant to the purpose",
                                items=types.Schema(
                                    type=types.Type.OBJECT,
                                    properties={
                                        "topic": types.Schema(
                                            type=types.Type.STRING,
                                            description="The grammar topic relevant to the context"
                                        ),
                                        "description": types.Schema(
                                            type=types.Type.STRING,
                                            description="Description of the grammar rule"
                                        ),
                                        "examples": types.Schema(
                                            type=types.Type.ARRAY,
                                            description="Examples of the grammar rule in use",
                                            items=types.Schema(
                                                type=types.Type.OBJECT,
                                                properties={
                                                    "sentence": types.Schema(
                                                        type=types.Type.STRING,
                                                        description="An example sentence demonstrating the grammar rule"
                                                    ),
                                                    "explanation": types.Schema(
                                                        type=types.Type.STRING,
                                                        description="Explanation of how the grammar rule is applied in the sentence"
                                                    )
                                                },
                                                required=[
                                                    "sentence", "explanation"]
                                            )
                                        )
                                    },
                                    required=[
                                        "topic", "description", "examples"]
                                )
                            )
                        },
                        required=["relevantGrammar"]
                    )
                )
            ]

            # Create the prompt for Gemini API
            prompt = f"""
            You are a language learning assistant that helps users learn grammar in context.
            
            Create a list of relevant grammar topics in {target_language} that would be helpful for a {source_language} speaker in the following context: {purpose}.
            
            For each grammar topic:
            1. Identify a grammar rule or pattern that is commonly used in this context
            2. Provide a clear description of how the grammar works
            3. Include 2-3 practical examples showing the grammar in use in this specific context
            4. For each example, explain how the grammar rule is applied
            
            The grammar topics should be specific to the context and immediately applicable.
            
            Respond with the function call to generate_grammar_lesson.
            """

            # Call Gemini API
            response = await gemini_service.call_gemini_with_function(prompt, function_declarations)

            if response and response.get("name") == "generate_grammar_lesson":
                args = response.get("args", {})

                # Convert the response to our model
                grammar_topics = []
                for topic_data in args.get("relevantGrammar", []):
                    examples = [
                        GrammarExample(
                            sentence=example.get("sentence", ""),
                            explanation=example.get("explanation", "")
                        )
                        for example in topic_data.get("examples", [])
                    ]

                    grammar_topic = GrammarTopic(
                        topic=topic_data.get("topic", ""),
                        description=topic_data.get("description", ""),
                        examples=examples
                    )

                    grammar_topics.append(grammar_topic)

                return GrammarResponse(relevantGrammar=grammar_topics)
            else:
                logger.error("Invalid response from Gemini API")
                raise ValueError("Invalid response from Gemini API")

        except Exception as e:
            logger.error(f"Error generating grammar lesson: {str(e)}")
            raise


grammar_service = GrammarService()
