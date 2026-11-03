# Milestone 2: RAG Security Hardening

This milestone extends the Milestone 1 retrieval-augmented generation (RAG) pipeline to evaluate security vulnerabilities and defensive strategies.

The project includes:

Expanded corpus: 85 documents spanning PDF, HTML, CSV, and Wikipedia JSON sources.

Retrieval evaluation: Gold-set evaluation using a predefined set of questions and expected sources.

Security testing: Experiments evaluating prompt-injection attacks and defensive measures.

Performance analysis: Comparisons of retrieval quality, attack outcomes, defense effectiveness, and costs.

## Repository Setup

Milestone 2 uses the original Milestone 1 documents alongside additional corpus sources. The repository includes the corpus manifest (corpus/manifest.jsonl), setup code, notebooks, and evaluation results.

The restricted ProQuest PDFs are not distributed in this repository. Reproducing the complete 85-document corpus requires authorized access to those documents.


### Installation

**1. Clone the repository**

```bash
git clone https://github.com/meganalvord/DATA-790-Milestone-1
cd DATA-790-Milestone-1
```

**2. Install Python dependencies**

```bash
python -m pip install -r requirements.txt
```

**3. Prepare the original corpus files**

```bash
python setup_corpus.py
```

This script copies the original Milestone 1 PDF, HTML, and CSV files into the directory structure expected by the Milestone 2 notebooks. It does not modify the original documents.


### Environment Configuration

The notebooks use environment variables to access the UNC AI Gateway and identify requests to the Wikipedia API.

**1. Create a local .env file

In Windows Anaconda Prompt:
```bash
copy .env.example .env
```
**2. Open .env and replace the placeholders
```bash
Replace the UNC_AI_API_KEY placeholder in .env with your own API key.
WIKIPEDIA_CONTACT_EMAIL=your_email@example.com
```
The UNC AI Gateway credentials are required for embedding and LLM operations. The email address is used to identify requests to Wikipedia.

**3. Keep credentials private

The .env file is excluded from Git through .gitignore. Never commit API keys or other credentials to the repository.


### Running Milestone 2

Run these commands from the repository's main directory after completing installation and environment configuration.

**1. Download the Wikipedia corpus**

```bash
jupyter nbconvert --to notebook --execute Corpus_Builder.ipynb --output Corpus_Builder_executed.ipynb
```

This notebook retrieves Wikipedia documents and prepares corpus metadata. Restricted ProQuest documents must be obtained separately through authorized access and placed in `corpus/new_files/proquest/` before running the baseline evaluation.

**2. Build the vector database and run gold-set retrieval evaluation**

```bash
jupyter nbconvert --to notebook --execute Baseline_New_Corpus_Milestone_2.ipynb --output Baseline_New_Corpus_Milestone_2_executed.ipynb
```

This notebook loads `gold_set_m2.json`, builds the Chroma vector database in `./chroma_db`, and evaluates retrieval performance.

**3. Run the security attack and defense suite**

```bash
jupyter nbconvert --to notebook --execute Security_Testing.ipynb --output Security_Testing_executed.ipynb
```

This notebook loads the existing Chroma database and runs the security experiments.

**Important:** The baseline notebook must execute successfully before the security notebook. Results may differ if the complete original corpus or the same model configuration is unavailable.

### Evaluation Results and Corpus Manifest

The repository includes the following evaluation outputs:

| File | Description |
|---|---|
| `gold_set_m2.json` | Gold-standard questions and expected sources for retrieval evaluation |
| `baseline_retrieval_m2.csv` | Baseline retrieval evaluation results |
| `baseline_retrieval_m2_by_type.csv` | Retrieval results grouped by document type |
| `security_baseline_results.csv` | Baseline security testing results |
| `direct_defense_comparison.csv` | Direct prompt-injection defense comparisons |
| `indirect_defense_comparison.csv` | Indirect prompt-injection defense comparisons |
| `a20_defense_comparison.csv` | Additional defense comparison results |
| `defended_generation_quality.csv` | Generation quality under defensive configurations |
| `security_false_positive_results.csv` | False-positive evaluation results |
| `security_cost_comparison.csv` | Security testing cost comparisons |

**Corpus manifest:** `corpus/manifest.jsonl`

The manifest contains metadata for the 85 documents used in the Milestone 2 experiments, including document paths, source information, and available licensing metadata.

Some corpus documents are excluded from the public repository because of redistribution restrictions. Consequently, the committed results represent the original experimental corpus and may not be reproduced exactly without access to the same documents.








# Milestone 1

## Running the Project

The RAG system is provided as a Jupyter notebook. The notebook contains the document ingestion, chunking strategies, vector database setup, retrieval pipeline, question answering, and evaluation procedures used in this project.

## Requirements

The project uses Python and the packages listed in the notebook imports. An Azure OpenAI connection is required for the embedding and language models. API credentials should be configured through environment variables and should not be committed to the repository.

## Evaluation

The notebook contains a bare minimum RAG pipeline with a small, 5 question gold set to demonstrate retrieval and source attribution. Then new questions are generated from a corpus of pdfs, csv files, and htm files. The retrieval evaluation using the set of 34 verified question/source pairs. The evaluation reports retrieval metrics including hit rate, recall, precision, and mean reciprocal rank (MRR) for the different chunking strategies. LLM-as-judge utilizes a higher tier LLM to evaluate the generation. K-tuning and cost analysis are also included.

