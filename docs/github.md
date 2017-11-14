# Github


## 1. Setup

1. Install Git

   Git for Windows - Link: https://git-for-windows.github.io/

   Version: 2.11.0 (as of 1/2/2017)
   
   Installation: accept all the default configuration during installation

2. Join the repository

   You should receive an email inviting you to collaborate on the repository. Accept the invitation.

   There are two repositories:
   * https://github.com/Code4SocialGood/c4sg-web (frontend)
   * https://github.com/Code4SocialGood/c4sg-services (backend)

3. Fork the repository

   In the top right corner of the repository page, click the button "Fork"

   Read more: https://help.github.com/articles/fork-a-repo/

4. Clone the forked repository to your local system
   1. Click the button: "Clone or download", copy the web URL. This URL is like: `https://github.com/<your_username>/c4sg-web.git`
   2. Click Windows Start button, launch "Git CMD"
   3. Create a new directory <your_local_directory> to copy the repository locally
  
   ```
   cd <your_prefered_path>
   > mkdir <your_local_repository_directory>
   > cd <your_local_repository_directory>
   ```

   4. Clone the repository to local: > git clone https://github.com/<your_username>/c4sg-web.git
Repository is copied locally to: <your_local_repository_directory>\<your_local_repository_directory>\c4sg-web


## 2. Sync Fork

1. Sync your fork

   You should sync your fork:
   * Before start your work each day, and
   * Before perform final test on your code change and create pull request

2. Check the current configured remote repository.

```
cd <your_local_repository_directory>/c4sg-web
git remote -v
```
This points to the fork.
```
origin  https://github.com/<your_username>/ c4sg-web.git (fetch)
origin  https://github.com/<your_username>/ c4sg-web.git (push)
```

3. Add upstream repositoryfor your fork

   `git remote add upstream https://github.com/Code4SocialGood/ c4sg-web.git`

4. Verify the new upstream repository

   `git remote -v`

   Your fork is the "origin" and the repository you forked from is the "upstream".
```
origin  https://github.com/<your_username>/ c4sg-web.git (fetch)
origin  https://github.com/<your_username>/ c4sg-web.git (push)
upstream        https://github.com/Code4SocialGood/ c4sg-web.git (fetch)
upstream        https://github.com/Code4SocialGood/ c4sg-web.git (push)
```

5. Fetch from upstream repository

   `git fetch upstream`

6. Check out your fork's local master branch

   `git checkout master`

7. Merge the changes from upstream/master into your local master branch, without losing your local changes

   `git merge upstream/master`

8. Publish your local commits so fork is synced up with upstream

   `git push`


## 3. Make Code Change and Submit Pull Request

1. Development

2. Check your current branch

   `git branch`

3. Create a branch for the issue you work on

   `git branch <new_branch_name>`

4. Switch to the created branch

   `git checkout <new_branch_name>`

5. Make code changes

6. Check status

   `git status`

7. Add the files you want to commit

   `git add <file_name>`

8. Commit the changes

   `git commit -m "<commit_message>"`
   
   You may be prompted to run "git config" to set your identity for this repository only or globally

9. Push the change to the fork

   `git push origin <new_branch_name>`

10. Create a Pull Request
    1. Go to Github, click "New Pull Request"
    2. In the headfork, choose `<new_branch_name>`
    3. Click: Create Pull Request

11. Choose Assignee

    Code4SocialGood


## 4. Review Pull Request

Read the section "Testing Someone Else's Pull Request" here: https://github.com/TeamPorcupine/ProjectPorcupine/wiki/How-to-Test-a-Pull-Request 
