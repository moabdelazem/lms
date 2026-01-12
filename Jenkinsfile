pipeline {
    agent any

    environment {
        APP_NAME = 'lms'
        DOCKER_REGISTRY = 'docker.io'
        DOCKER_USERNAME = 'moabdelazem'
        DOCKER_CREDENTIALS = 'docker-hub-credentials'
        API_IMAGE = "${DOCKER_USERNAME}/${APP_NAME}-api"
        WEB_IMAGE = "${DOCKER_USERNAME}/${APP_NAME}-web"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    env.COMMIT_SHA = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                    env.BUILD_TAG = "${env.COMMIT_SHA}-${env.BUILD_NUMBER}"
                }
            }
        }

        stage('Lint') {
            agent {
                docker {
                    image 'node:22-bookworm-slim'
                    reuseNode true
                }
            }
            environment {
                NPM_CONFIG_CACHE = "${WORKSPACE}/.npm"
            }
            steps {
                dir('api') {
                    sh 'npm ci'
                    sh 'npm run lint'
                }
            }
        }

        stage('Build Docker Images') {
            parallel {
                stage('Build API Image') {
                    steps {
                        script {
                            docker.build("${API_IMAGE}:${BUILD_TAG}", "-f api/Dockerfile api")
                            docker.build("${API_IMAGE}:latest", "-f api/Dockerfile api")
                        }
                    }
                }
                stage('Build Web Image') {
                    steps {
                        script {
                            docker.build("${WEB_IMAGE}:${BUILD_TAG}", "--build-arg VITE_API_URL=/api -f web/Dockerfile web")
                            docker.build("${WEB_IMAGE}:latest", "--build-arg VITE_API_URL=/api -f web/Dockerfile web")
                        }
                    }
                }
            }
        }

        stage('Push Docker Images') {
            when {
                branch 'main'
            }
            steps {
                script {
                    withCredentials([usernamePassword(
                        credentialsId: "${DOCKER_CREDENTIALS}",
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )]) {
                        sh 'echo $DOCKER_PASS | docker login ${DOCKER_REGISTRY} -u $DOCKER_USER --password-stdin'
                        
                        // Push API images
                        sh "docker push ${API_IMAGE}:${BUILD_TAG}"
                        sh "docker push ${API_IMAGE}:latest"
                        
                        // Push Web images
                        sh "docker push ${WEB_IMAGE}:${BUILD_TAG}"
                        sh "docker push ${WEB_IMAGE}:latest"
                    }
                }
            }
        }

        stage('Security Scan') {
            steps {
                script {
                    // Scan API image with Trivy 
                    sh """
                        docker run --rm \
                            -v /var/run/docker.sock:/var/run/docker.sock \
                            -v ${WORKSPACE}:/workspace \
                            aquasec/trivy:latest image \
                            --exit-code 0 \
                            --severity CRITICAL \
                            --format table \
                            ${API_IMAGE}:${BUILD_TAG}
                    """
                    
                    // Scan Web image with Trivy
                    sh """
                        docker run --rm \
                            -v /var/run/docker.sock:/var/run/docker.sock \
                            -v ${WORKSPACE}:/workspace \
                            aquasec/trivy:latest image \
                            --exit-code 0 \
                            --severity CRITICAL \
                            --format table \
                            ${WEB_IMAGE}:${BUILD_TAG}
                    """
                }
            }
        }

        stage('Cleanup') {
            steps {
                script {
                    sh "docker rmi ${API_IMAGE}:${BUILD_TAG} || true"
                    sh "docker rmi ${API_IMAGE}:latest || true"
                    sh "docker rmi ${WEB_IMAGE}:${BUILD_TAG} || true"
                    sh "docker rmi ${WEB_IMAGE}:latest || true"
                }
            }
        }
    }

    post {
        always {
            sh 'docker system prune -af --volumes || true'
            cleanWs()
        }
        success {
            echo "Pipeline completed successfully!"
            echo "API Image: ${API_IMAGE}:${BUILD_TAG}"
            echo "Web Image: ${WEB_IMAGE}:${BUILD_TAG}"
        }
        failure {
            echo "Pipeline failed. Check the logs for details."
        }
    }
}