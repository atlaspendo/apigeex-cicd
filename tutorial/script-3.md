## Workflow Implementation (10 minutes)

### 1. Workflow Structure
[Show VS Code with workflow file]

**Narration:**
"Let's examine our workflow structure. This is our reusable workflow that handles the deployment:

```yaml
name: Apigee Proxy Deployment [Reusable Workflow]
on:
  workflow_call:
    inputs:
      proxy_name:
        description: The name of the API proxy to deploy
        required: true
        type: string
```

We're using a reusable workflow for consistency across multiple repositories."

### 2. Authentication Implementation
[Show authentication code]

**Narration:**
"The authentication step is critical:

```yaml
- name: Authenticate to Google Cloud
  uses: 'google-github-actions/auth@v1'
  with:
    workload_identity_provider: ${{ secrets.workload_identity_provider }}
    service_account: ${{ secrets.service_account }}
    token_format: 'access_token'
```

This step exchanges the GitHub token for a Google Cloud token. No credentials are stored - everything is exchanged in real-time."

### 3. Deployment Process
[Show deployment code]

**Narration:**
"The deployment process is handled in stages:

1. Environment Preparation:
```yaml
Prepare_Environment_List:
    runs-on: ${{ inputs.runner }}
    outputs:
      environments: ${{ steps.set-envs.outputs.environments }}
```

2. Bundle Creation:
```yaml
- name: Create API bundle
  run: |
    create_bundle() {
      local source_dir="$1"
      zip -r proxy.zip apiproxy
    }
```

3. Deployment:
```yaml
- name: Deploy to Environment
  run: |
    $HOME/.apigeecli/bin/apigeecli apis deploy
```

Each stage has error handling and validation built in."
