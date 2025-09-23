# GitHub Repository Transfer Guide: From ak to Nikil-logesh

This guide details the complete process for transferring a project repository from the user `ak` to `Nikil-logesh` on GitHub, including all commands and explanations for each step.

---

## 1. Prepare the Local Repository

Make sure your local repository is up to date and on the correct branch (usually `main`):

```powershell
git status
git checkout main
git pull
```

---

## 2. Change the Remote URL

Update the remote URL to point to the new GitHub repository under `Nikil-logesh`:

```powershell
git remote -v  # Check current remotes
git remote set-url origin https://github.com/Nikil-logesh/soulsync.git
git remote -v  # Verify the change
```

---

## 3. Install GitHub CLI (gh)

### Method 1: Using Windows Package Manager (winget)
```powershell
winget install --id GitHub.cli
```

### Method 2: Download from GitHub
- Go to: https://github.com/cli/cli/releases
- Download the latest `.msi` installer for Windows
- Run the installer

### Method 3: Using Chocolatey
```powershell
choco install gh
```

### Method 4: Using Scoop
```powershell
scoop install gh
```

---

## 4. Authenticate with GitHub CLI

Log in to your GitHub account using the CLI:

```powershell
gh auth login
```
- Choose: `GitHub.com`
- Protocol: `HTTPS`
- Authenticate Git: `Yes`
- Login method: `Login with a web browser`
- Follow the prompts to complete authentication

---

## 5. Push the Code to the New Repository

Push your local code to the new remote:

```powershell
git push -u origin main
```
- This uploads all your code to the `main` branch of the new repository.

---

## 6. Verify the Transfer

Go to: https://github.com/Nikil-logesh/soulsync
- Confirm that your code and commit history are present.

---

## 7. Troubleshooting

- If you encounter authentication errors, ensure you are logged in with the correct GitHub account using `gh auth login`.
- If `gh` is not recognized, restart your terminal or refresh your PATH variable.
- For permission issues, check repository access rights on GitHub.

---

## Summary Table

| Step | Command(s) | Purpose |
|------|------------|---------|
| 1    | `git status`, `git checkout main`, `git pull` | Prepare local repo |
| 2    | `git remote -v`, `git remote set-url ...` | Change remote URL |
| 3    | `winget install --id GitHub.cli` (or alternatives) | Install GitHub CLI |
| 4    | `gh auth login` | Authenticate with GitHub |
| 5    | `git push -u origin main` | Push code to new repo |
| 6    | (Web browser) | Verify transfer |

---

**You have now successfully transferred your repository from `ak` to `Nikil-logesh`!**
