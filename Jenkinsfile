pipeline {
    agent {
        docker {
            image 'node:12'
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
                sh 'npx lerna bootstrap'
            }
        }
        stage('Build') {
            when {
                branch 'main'
            }
            steps {
                withCredentials([string(credentialsId: 'npm-publish-token', variable: 'NPM_TOKEN')]) {
                    sh 'npm run build'
                }
            }
        }
        stage('Lerna publish') {
            when {
                branch 'main'
            }
            steps {
                withCredentials([string(credentialsId: 'npm-publish-token', variable: 'NPM_TOKEN')]) {
                    sh "npx lerna publish --skip-git --yes from-package"
                }
            }
        }
    }
}
