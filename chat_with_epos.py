#!/usr/bin/env python3
"""
chat_with_epos.py - Chat interface for EPOS emergency management knowledge

This script creates a chat interface that uses your processed emergency management
documents as context for the local language model.

Usage:
    python chat_with_epos.py
"""

import os
import sys
from pathlib import Path
import ollama
from typing import List, Optional
import argparse


class EPOSChat:
    def __init__(self, model_name: str = "llama3.2:1b", data_dir: str = None):
        """Initialize the EPOS chat system."""
        self.model_name = model_name
        self.data_dir = Path(data_dir) if data_dir else Path(__file__).parent / "training_materials/processed/all_text/anonymized"
        self.context_documents = []
        self.load_context()
        
    def load_context(self) -> None:
        """Load the anonymized emergency management documents as context."""
        if not self.data_dir.exists():
            print(f"Warning: Data directory not found: {self.data_dir}")
            return
            
        txt_files = list(self.data_dir.glob("*.txt"))
        # Filter out report files
        txt_files = [f for f in txt_files if not f.name.startswith("anonymization_")]
        
        print(f"Loading {len(txt_files)} emergency management documents...")
        
        for file_path in txt_files:
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                self.context_documents.append({
                    'filename': file_path.name,
                    'content': content[:2000]  # Limit to first 2000 chars per document
                })
                print(f"  ✓ Loaded: {file_path.name}")
                
            except Exception as e:
                print(f"  ✗ Error loading {file_path.name}: {e}")
        
        print(f"Successfully loaded {len(self.context_documents)} documents\n")
    
    def create_context_prompt(self, user_question: str) -> str:
        """Create a prompt that includes relevant emergency management context."""
        
        # Create a consolidated context from all documents
        context_text = "\n\n".join([
            f"=== {doc['filename']} ===\n{doc['content']}"
            for doc in self.context_documents
        ])
        
        prompt = f"""You are an emergency management expert assistant. Use the following emergency management documents as context to answer questions. The documents contain emergency plans, procedures, and protocols that have been anonymized for privacy.

EMERGENCY MANAGEMENT CONTEXT:
{context_text}

Based on the emergency management documents above, please answer this question:
{user_question}

Please provide a detailed, practical answer based on the emergency management knowledge in the context. If the context doesn't contain relevant information, say so and provide general emergency management guidance."""

        return prompt
    
    def chat(self, message: str) -> str:
        """Send a message to the model with emergency management context."""
        try:
            prompt = self.create_context_prompt(message)
            
            response = ollama.chat(
                model=self.model_name,
                messages=[
                    {
                        'role': 'user',
                        'content': prompt
                    }
                ]
            )
            
            return response['message']['content']
            
        except Exception as e:
            return f"Error: {str(e)}"
    
    def interactive_chat(self) -> None:
        """Start an interactive chat session."""
        print("🚨 EPOS Emergency Management Chat Assistant 🚨")
        print("=" * 50)
        print(f"Using model: {self.model_name}")
        print(f"Context documents: {len(self.context_documents)}")
        print("Type 'quit', 'exit', or 'bye' to end the session")
        print("Type 'help' for example questions")
        print("-" * 50)
        
        while True:
            try:
                user_input = input("\n🔹 Your question: ").strip()
                
                if not user_input:
                    continue
                    
                if user_input.lower() in ['quit', 'exit', 'bye']:
                    print("\nGoodbye! Stay prepared! 🚨")
                    break
                    
                if user_input.lower() == 'help':
                    self.show_help()
                    continue
                    
                print("\n🤖 EPOS Assistant: Thinking...")
                response = self.chat(user_input)
                print(f"\n🤖 EPOS Assistant:\n{response}")
                
            except KeyboardInterrupt:
                print("\n\nGoodbye! Stay prepared! 🚨")
                break
            except Exception as e:
                print(f"\nError: {e}")
    
    def show_help(self) -> None:
        """Show example questions."""
        print("\n📋 Example Questions:")
        print("- What are the key steps in emergency response planning?")
        print("- How should we handle a hazardous materials incident?")
        print("- What communication protocols should be followed during an emergency?")
        print("- How do we coordinate with external agencies during a crisis?")
        print("- What are the evacuation procedures for different types of emergencies?")
        print("- How should we prepare for working alone safety procedures?")
        print("- What are the roles and responsibilities during emergency management?")


def main():
    parser = argparse.ArgumentParser(description="Chat with EPOS emergency management assistant")
    parser.add_argument("--model", default="llama3.2:1b", help="Ollama model name to use")
    parser.add_argument("--data-dir", help="Directory containing anonymized training data")
    parser.add_argument("--question", help="Ask a single question instead of interactive mode")
    
    args = parser.parse_args()
    
    # Check if Ollama is running
    try:
        ollama.list()
    except Exception as e:
        print(f"Error: Cannot connect to Ollama. Is it running?")
        print("Start it with: brew services start ollama")
        sys.exit(1)
    
    # Check if model exists
    try:
        model_list = ollama.list()
        if 'models' in model_list:
            models = [model['name'] for model in model_list['models']]
            if args.model not in models:
                print(f"Error: Model '{args.model}' not found.")
                print(f"Available models: {', '.join(models)}")
                print(f"Download it with: ollama pull {args.model}")
                sys.exit(1)
        else:
            print(f"Warning: Could not verify model existence. Proceeding with {args.model}")
    except Exception as e:
        print(f"Warning: Error checking models: {e}. Proceeding with {args.model}")
    
    # Initialize chat
    chat = EPOSChat(model_name=args.model, data_dir=args.data_dir)
    
    if args.question:
        # Single question mode
        print(f"Question: {args.question}")
        print("=" * 50)
        response = chat.chat(args.question)
        print(response)
    else:
        # Interactive mode
        chat.interactive_chat()


if __name__ == "__main__":
    main()
