## Running the Project

The RAG system is provided as a Jupyter notebook. The notebook contains the document ingestion, chunking strategies, vector database setup, retrieval pipeline, question answering, and evaluation procedures used in this project.

## Requirements

The project uses Python and the packages listed in the notebook imports. An Azure OpenAI connection is required for the embedding and language models. API credentials should be configured through environment variables and should not be committed to the repository.

## Evaluation

The notebook contains a bare minimum RAG pipeline with a small, 5 question gold set to demonstrate retrieval and source attribution. Then new questions are generated from a corpus of pdfs, csv files, and htm files. The retrieval evaluation using the set of 34 verified question/source pairs. The evaluation reports retrieval metrics including hit rate, recall, precision, and mean reciprocal rank (MRR) for the different chunking strategies. LLM-as-judge utilizes a higher tier LLM to evaluate the generation. K-tuning and cost analysis are also included.
