## Implementation Steps (15 minutes)

### 1. Google Cloud Setup
[Show GCP Console]

**Narration:**
"Let's start with Google Cloud setup. First, ensure you have the necessary permissions.

```bash
# Set our variables
export PROJECT_ID="your-project-id"
export GITHUB_ORG="your-github-org"
```

We'll create a Workload Identity Pool:
```bash
gcloud iam workload-identity-pools create "github-actions" \
    --project="${PROJECT_ID}" \
    --location="global" \
    --display-name="GitHub Actions Pool"
```

This pool will manage external identities from GitHub. Think of it as a secure gateway for external authentication."

[Show Pool Creation]

**Narration:**
"Next, we'll create our Workload Identity Provider:
```bash
gcloud iam workload-identity-pools providers create-oidc "github" \
    --project="${PROJECT_ID}" \
    --location="global" \
    --workload-identity-pool="github-actions" \
    --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository" \
    --issuer-uri="https://token.actions.githubusercontent.com"
```

The attribute mapping is crucial - it tells GCP how to interpret GitHub's tokens."

### 2. Service Account Configuration
[Display IAM Console]

**Narration:**
"Now, let's setup our service account:

```bash
# Create service account
export SA_NAME="apigee-deployer"
gcloud iam service-accounts create ${SA_NAME} \
    --project="${PROJECT_ID}" \
    --display-name="Apigee Deployment Service Account"

# Assign necessary roles
gcloud projects add-iam-policy-binding ${PROJECT_ID} \
    --member="serviceAccount:${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com" \
    --role="roles/apigee.apiAdmin"
```

This service account needs specific permissions for Apigee operations. We're following the principle of least privilege."

### 3. GitHub Repository Setup
[Show GitHub Interface]

**Narration:**
"Moving to GitHub, we'll set up our repository:

1. Create these directories:
   ```
   .github/workflows/
   apiproxy/
   ```

2. Configure repository secrets:
   - APIGEE_ORG
   - WORKLOAD_IDENTITY_PROVIDER
   - SERVICE_ACCOUNT

These secrets are crucial but never exposed in our workflows."
