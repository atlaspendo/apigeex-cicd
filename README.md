# Apigee Proxy Deployment Automation

This repository contains GitHub Actions workflows for automating Apigee API proxy deployments using Workload Identity Federation for authentication.

## 📋 Table of Contents
- [Architecture & Flow](#architecture--flow)
- [Prerequisites](#prerequisites)
- [Google Cloud Setup](#google-cloud-setup)
- [GitHub Configuration](#github-configuration)
- [Repository Structure](#repository-structure)
- [Workflow Features](#workflow-features)
- [Usage Guide](#usage-guide)
- [Troubleshooting](#troubleshooting)

## 🏗️ Architecture & Flow

### Deployment Pipeline Flow
```mermaid
flowchart TB
    subgraph "🌟 Trigger Events"
        A1["Push to main"] --> T
        A2["Manual trigger"] --> T
        T["Workflow Start"]
    end

    subgraph "🔐 Authentication"
        T --> B["GCP Workload Identity"]
        B --> C["Generate Access Token"]
    end

    subgraph "🔍 Validation"
        C --> D["API Proxy Lint Check"]
        D --> E["Bundle Creation"]
    end

    subgraph "📦 Upload Process"
        E --> F["Upload to Apigee"]
        F --> G["Get Revision Number"]
    end

    subgraph "🚀 Deployment"
        G --> H{"Environment Matrix"}
        H --> I1["Deploy to Dev"]
        H --> I2["Deploy to Test"]
        H --> I3["Deploy to UAT"]
    end

    subgraph "🧹 Cleanup"
        I1 --> J["Cleanup Old Revisions"]
        I2 --> J
        I3 --> J
    end

    subgraph "📊 Results"
        J --> K["Generate Summary"]
        K --> L["Display Status"]
    end

    style T fill:#4299e1,color:#fff
    style B fill:#48bb78,color:#fff
    style D fill:#ecc94b,color:#000
    style F fill:#ed8936,color:#fff
    style H fill:#667eea,color:#fff
    style J fill:#9f7aea,color:#fff
    style L fill:#f56565,color:#fff
```

### Component Interaction
```mermaid
sequenceDiagram
    participant GH as GitHub Actions
    participant WIF as Workload Identity
    participant GCP as Google Cloud
    participant AP as Apigee Platform

    GH->>WIF: Request Authentication
    activate WIF
    Note over WIF: Verify GitHub OIDC Token
    WIF->>GCP: Exchange Token
    GCP-->>WIF: Return GCP Access Token
    WIF-->>GH: Token Response
    deactivate WIF

    activate GH
    Note over GH: Run apigeelint
    Note over GH: Create API Bundle

    GH->>AP: Upload API Bundle
    activate AP
    AP-->>GH: Return Revision Number
    deactivate AP

    par Deploy to Environments
        GH->>AP: Deploy to Dev
        AP-->>GH: Dev Status
    and
        GH->>AP: Deploy to Test
        AP-->>GH: Test Status
    and
        GH->>AP: Deploy to UAT
        AP-->>GH: UAT Status
    end

    Note over GH: Cleanup Old Revisions
    GH->>AP: Delete Old Revisions
    AP-->>GH: Cleanup Status

    Note over GH: Generate Summary
    deactivate GH
```

### System Architecture
```mermaid
flowchart LR
    subgraph GitHub ["GitHub Platform"]
        direction TB
        A["Repository"] --> B["GitHub Actions"]
        B --> C["OIDC Token"]
    end

    subgraph GCP ["Google Cloud Platform"]
        direction TB
        D["Workload Identity Federation"] --> E["IAM & Admin"]
        E --> F["Service Account"]
    end

    subgraph Apigee ["Apigee Platform"]
        direction TB
        G["API Proxies"] --> H["Environments"]
        H --> I["Deployments"]
    end

    C -->|Authentication| D
    F -->|Access| G

    style GitHub fill:#24292e,color:#fff
    style GCP fill:#4285f4,color:#fff
    style Apigee fill:#47bc6c,color:#fff
```

### Flow Explanation

1. **Trigger Events** 🌟
   - Push to main branch
   - Manual workflow dispatch
   - Automated schedule (if configured)

2. **Authentication** 🔐
   - GitHub OIDC token generation
   - Workload Identity Federation exchange
   - GCP service account token acquisition

3. **Validation** 🔍
   - API proxy linting with apigeelint
   - Bundle structure verification
   - Policy validation

4. **Upload Process** 📦
   - Bundle creation
   - Version management
   - Revision tracking

5. **Deployment** 🚀
   - Matrix-based environment deployment
   - Parallel deployment capability
   - Environment-specific configurations

6. **Cleanup** 🧹
   - Old revision removal
   - Keeping last N versions
   - Cleanup verification

7. **Results** 📊
   - Deployment status summary
   - Environment status report
   - Visual success/failure indicators

[Rest of the README content remains the same...]
