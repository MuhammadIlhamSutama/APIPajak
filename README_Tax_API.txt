
# Tax Calculation API

This API provides endpoints for calculating taxes, including under specific regulations for 2025 and beyond, as well as progressive tax calculations. The API is built with Node.js, Express.js, and CORS.

## Features

- Tax calculation under 2025 rules
- Tax calculation for 2025 and beyond
- Progressive tax calculation based on bookkeeping

## Prerequisites

Ensure the following software is installed on your system:

- Node.js (v14 or later)
- npm (Node Package Manager)

## Installation

1. Clone the repository or download the project files.

   ```bash
   git clone <repository-link>
   cd <repository-folder>
   ```

2. Install dependencies.

   ```bash
   npm install
   ```

3. Ensure the `Dockerfile` and `app.js` are properly configured.

## Usage

### Local Environment

1. Start the server.

   ```bash
   npm run start
   ```

2. The server will run at `http://localhost:8080`.

### Deployment

The API is deployed and can be accessed at:

[https://umkm-pajak-api-57151910209.asia-southeast2.run.app](https://umkm-pajak-api-57151910209.asia-southeast2.run.app)

## API Endpoints

### 1. **Calculate Tax Under 2025 Rules**

- **URL:** `/calculate-under2025`
- **Method:** POST
- **Request Body:**

```json
{
  "tahun": 2025,
  "penghasilan": 75000000,
  "golongan": "TK/0"
}
```

- **Response:** Tax amount based on rules.

### 2. **Calculate Tax for 2025**

- **URL:** `/calculate-2025`
- **Method:** POST
- **Request Body:**

```json
{
  "penghasilan": 50000000,
  "golongan": "TK/0",
  "norma": 20
}
```

- **Response:** Tax details including PKP and PPh.

### 3. **Progressive Tax Calculation**

- **URL:** `/calculate-pembukuan-progresif`
- **Method:** POST
- **Request Body:**

```json
{
  "penghasilan": 100000000,
  "hargaPokok": 50000000,
  "biayaUsaha": 20000000,
  "golongan": "K/1"
}
```

- **Response:** Progressive tax details.

## Error Handling

- All errors are returned in JSON format with an appropriate error message.

## License

This project is licensed under the MIT License.
