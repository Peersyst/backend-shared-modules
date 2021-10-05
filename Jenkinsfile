pipeline {
    agent {
        docker {
            image 'node:12'
            reuseNode true
        }
    }
    environment {
        HOME = '.'
    }
    stages {
        stage('Install') {
            when {
                branch 'main'
            }
            steps {
                sh 'npm install'
            }
        }
        stage('Lerna bootstrap') {
            when {
                branch 'main'
            }
            steps {
                sh 'lerna bootstrap'
            }
        }
        stage('Lerna publish') {
            when {
                branch 'main'
            }
            steps {
                withCredentials([string(credentialsId: 'npm-publish-token', variable: 'NPM_TOKEN')]) {
                    sh "echo //registry.npmjs.org/:_authToken=${env.NPM_TOKEN} > .npmrc"
                    sh 'lerna publish --yes'
                }
            }
        }
    }
}
