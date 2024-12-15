
# Tax Calculation API

This API provides endpoints for calculating taxes, including under specific regulations for 2025 and beyond, as well as progressive tax calculations. The API is built with Node.js, Express.js, and CORS.

## Features

- Tax calculation under 2025 rules
- Tax calculation for 2025 and beyond
- Progressive tax calculation based on bookkeeping
- Chat-bot ai assistant 

## Prerequisites

Ensure the following software is installed on your system:

- Node.js (v14 or later)
- npm (Node Package Manager)

## Installation

1. Clone the repository or download the project files.

   ```bash
   git clone https://github.com/MuhammadIlhamSutama/APIPajak.git
   ```

2. Install dependencies in google cloud console.

   ```bash
   sudo install nodejs
   npm init
   npm install cors express 
   ```
3. Ensure the `Dockerfile` and `app.js` are properly configured.

## you can deploy this api with cloud run heres the step by step

  # Deployment Instructions for Tax Calculation API
  
  This guide explains how to deploy the Tax Calculation API on Google Cloud Run.
  
  ## Prerequisites
  
  Ensure the following tools are installed:
  - [Docker](https://www.docker.com/)
  - [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)
  
  ## Steps
  
  ### 1. **Dockerize Your Application**
  Make sure your project directory contains a `Dockerfile` configured to build your application.
  
  ### 2. **Build the Docker Image**
  Run the following command to build the Docker image:
  
  ```bash
  docker build -t gcr.io/<PROJECT_ID>/diagflowapi .
  ```
  
  Replace `<PROJECT_ID>` with your Google Cloud Project ID.
  
  ### 3. **Push the Docker Image to Google Container Registry**
  Push the built image to Google Container Registry using the following command:
  
  ```bash
  docker push gcr.io/<PROJECT_ID>/diagflowapi
  ```
  
  ### 4. **Deploy the Image to Google Cloud Run**
  Deploy the image to Google Cloud Run with the following command:
  
  ```bash
  gcloud run deploy diagflowapi \
    --image gcr.io/<PROJECT_ID>/tax-api \
    --platform managed \
    --region <REGION> \
    --allow-unauthenticated \
    --port 8080
  ```
  
  Replace:
  - `<PROJECT_ID>`: Your Google Cloud Project ID.
  - `<REGION>`: The desired deployment region (e.g., `asia-southeast2` for Southeast Asia).

  # Here s the example of the deployment looks like ( after clone )

   gcloud run deploy diagflowapi   --image gcr.io/easytax-d09d2/easytax-api:latest   --platform managed   --region asia-southeast2   --allow-unauthenticated
  
  ### 5. **Test Your API**
  Once deployed, Google Cloud Run will provide a URL for your API. Test it using tools like `curl` or Postman.
  
  ### Deployment


The Original API is can be accessed at:
```bash
 https://diagflowapi-1071674645783.asia-southeast2.run.app/
```

## Usage
- **Endpoint:** `/calculate-under2025`
- **Method:** POST
- **Request Body:**
  ```json
  {
    "tahun": 3,
    "penghasilan": 600000000,
    "golongan": "PT"
  }
  ```
- **Response:**
  ```json
  {
    "taxAmount": 3000000
  }
  ```

### **2. Calculate Tax for 2025 Rules (with Norma)**
- **Endpoint:** `/calculate-2025`
- **Method:** POST
- **Request Body:**
  ```json
  {
    "penghasilan":1200000000,
    "golongan":"TK/0",
    "norma": 30
   }

  ```
- **Response:**
  ```json
    {
       "penghasilan": 1200000000,
       "penghasilanNetto": 360000000,
       "ptkp": 54000000,
       "pkp": 306000000,
       "PPHTerutang": 3791666.6666666665,
       "taxAmount": 3791667
    }
  ```
- untuk mengetahui jumlah norma kena pajak anda dapat melihatnya pada situs berikut [klu](https://datacenter.ortax.org/ortax/norma/norma)
  
### **3. Calculate Progressive Tax for Businesses**
- **Endpoint:** `/calculate-pembukuan-progresif`
- **Method:** POST
- **Request Body:**
  ```json
  {
  "penghasilan": 2400000000,
  "hargaPokok": 1500000000,
  "biayaUsaha": 500000000,
  "golongan": "TK/0"
   }
  ```
- **Response:**
  ```json
  {
    "totalPajak": 55500000
  }
  ```
### **4. SATA-Chatbot**
- **Endpoint:** `/chat`
- **Method:** POST
- **Request Body:**
  ```json
  {
    "message": "siapa kamu"
  }
  ```
- **Response:**
  ```json
  {
    "reply": [
        "Saya adalah asisten AI dan saya dibuat untuk membantu Anda di situs web SATA-Comp. Bagaimana saya dapat membantu Anda hari ini?"
    ]
  }  

---

## 🛠 **Technologies Used**
- **Node.js**
- **Express.js**
- **CORS**
- **Cloud Run**
- **Docker**
- **Google Cloud Console**


- All errors are returned in JSON format with an appropriate error message.

## License

Copyright (c) 2024 Muhammad Ilham Sutama
