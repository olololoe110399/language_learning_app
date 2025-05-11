# Language Learning App
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/olololoe110399/language_learning_app)

## Overview

The Language Learning App is a FastAPI-based backend that leverages Google’s Gemini AI to deliver personalized language learning experiences . It exposes a unified API through which clients can access four AI-powered features—grammar explanations, vocabulary “tiny lessons,” slang conversation generators, and image-based word recognition .

## Purpose & Scope

This application aims to cover diverse facets of language acquisition:

* **Grammar API**: Teaches grammatical concepts and rules.
* **Tiny Lesson API**: Builds compact vocabulary lessons with contextual usage.
* **Slang Hang API**: Generates colloquial dialogues to teach idioms and slang.
* **Word Cam API**: Uses image recognition to teach object names in the target language .

## System Architecture

The app follows a clean, layered architecture pattern with clear separation of concerns:

1. **API Layer**: Defines FastAPI routers (`grammar.router`, `tiny_lesson.router`, `slang_hang.router`, `word_cam.router`).
2. **Services Layer**: Encapsulates business logic in dedicated service classes (`GrammarService`, `TinyLessonService`, etc.).
3. **Data Models**: Uses Pydantic models for request/response validation and internal data structures .

### Architectural Diagram

```
Client → FastAPI Routers → Services → Google Gemini API → Services → Response
```

For a detailed overview, see the System Architecture section in the source .

## Core Features

| Feature                                                                                                                                                | Purpose                                             | Router               |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------- | -------------------- |
| **Grammar**                                                                                                                                            | Provides grammar lessons with examples/explanations | `grammar.router`     |
| **Tiny Lesson**                                                                                                                                        | Delivers compact vocabulary lessons in context      | `tiny_lesson.router` |
| **Slang Hang**                                                                                                                                         | Generates conversational scenarios using slang      | `slang_hang.router`  |
| **Word Cam**                                                                                                                                           | Recognizes objects in images and teaches vocabulary | `word_cam.router`    |
| All four features are orchestrated via separate API endpoints and underlying services    . |                                                     |                      |

## Technology Stack

* **FastAPI**: High-performance ASGI framework.
* **Pydantic**: Data validation and settings management.
* **Uvicorn**: ASGI server for production deployment.
* **Google Gemini AI**: Powers all four language features. 

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/olololoe110399/language_learning_app.git
   cd language_learning_app/backend
   ```
2. **Install dependencies**

   ````bash
   pip install -r requirements.txt
   ``` :contentReference[oaicite:10]{index=10}  
   ````
3. **Set up Gemini credentials** in your environment (e.g., `GOOGLE_GEMINI_API_KEY`).

## Usage & Request Flow

1. Start the server:

   ```bash
   uvicorn app.main:app --reload
   ```
2. A request (e.g., `/grammar/lesson`) travels from the FastAPI router → Service layer → Gemini API → Service layer → JSON response .
3. All responses adhere to Pydantic schemas for consistency.

## API Reference

All endpoints are mounted on the FastAPI app in `app/main.py`. Key routers include:

* **Grammar**: `/grammar/...`
* **Tiny Lesson**: `/tiny_lesson/...`
* **Slang Hang**: `/slang_hang/...`
* **Word Cam**: `/word_cam/...` 。

## Error Handling

A global exception handler catches uncaught errors, logs them, and returns a standardized JSON error format to the client (status codes, error messages) .

## Contributing

Contributions are welcome! Please fork the repo, open an issue for major changes, and submit pull requests for review. Follow the existing code style and include tests where applicable.

## License

This project is released under the MIT License. See the [LICENSE](LICENSE) file for details.
