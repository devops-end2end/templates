module github.com/${{ values.repoUrl | parseRepoUrl | pick('owner') }}/${{ values.componentId }}

go 1.22
