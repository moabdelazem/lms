pipeline {
    agent any

    environment {
        APP_NAME = 'lms'
        DOCKER_REGISTRY = 'docker.io'
        DOCKER_USERNAME = 'moabdelazem'
        DOCKER_CREDENTIALS = 'docker-hub-credentials'
        API_IMAGE = "${DOCKER_USERNAME}/${APP_NAME}-api"
        WEB_IMAGE = "${DOCKER_USERNAME}/${APP_NAME}-web"
        TRIVY_SEVERITY = 'CRITICAL'
        TRIVY_EXIT_CODE = '0'  // Set to '1' to fail on vulnerabilities
    }

    options {
        timestamps()
        buildDiscarder(logRotator(numToKeepStr: '10'))
        disableConcurrentBuilds()
        timeout(time: 30, unit: 'MINUTES')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    env.COMMIT_SHA = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                    env.BUILD_TAG = "${env.COMMIT_SHA}-${env.BUILD_NUMBER}"
                    env.GIT_BRANCH_NAME = sh(script: 'git rev-parse --abbrev-ref HEAD', returnStdout: true).trim()
                    
                    echo "Branch: ${env.GIT_BRANCH_NAME}"
                    echo "Commit: ${env.COMMIT_SHA}"
                    echo "Build Tag: ${env.BUILD_TAG}"
                }
            }
        }

        stage('Lint & Audit') {
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
                    sh 'npm audit --audit-level=critical || true'
                }
            }
        }

        stage('Build Docker Images') {
            parallel {
                stage('Build API Image') {
                    steps {
                        script {
                            docker.build("${API_IMAGE}:${BUILD_TAG}", "-f api/Dockerfile api")
                        }
                    }
                }
                stage('Build Web Image') {
                    steps {
                        script {
                            docker.build("${WEB_IMAGE}:${BUILD_TAG}", "--build-arg VITE_API_URL=/api -f web/Dockerfile web")
                        }
                    }
                }
            }
        }

        stage('Security Scan') {
            parallel {
                stage('Scan API Image') {
                    steps {
                        script {
                            sh """
                                docker run --rm \
                                    -v /var/run/docker.sock:/var/run/docker.sock \
                                    aquasec/trivy:latest image \
                                    --exit-code ${TRIVY_EXIT_CODE} \
                                    --severity ${TRIVY_SEVERITY} \
                                    --format table \
                                    --ignore-unfixed \
                                    ${API_IMAGE}:${BUILD_TAG}
                            """
                        }
                    }
                }
                stage('Scan Web Image') {
                    steps {
                        script {
                            sh """
                                docker run --rm \
                                    -v /var/run/docker.sock:/var/run/docker.sock \
                                    aquasec/trivy:latest image \
                                    --exit-code ${TRIVY_EXIT_CODE} \
                                    --severity ${TRIVY_SEVERITY} \
                                    --format table \
                                    --ignore-unfixed \
                                    ${WEB_IMAGE}:${BUILD_TAG}
                            """
                        }
                    }
                }
            }
        }

        stage('Push Docker Images') {
            when {
                expression { env.GIT_BRANCH_NAME == 'main' || env.BRANCH_NAME == 'main' }
            }
            steps {
                script {
                    withCredentials([usernamePassword(
                        credentialsId: "${DOCKER_CREDENTIALS}",
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )]) {
                        sh 'echo $DOCKER_PASS | docker login ${DOCKER_REGISTRY} -u $DOCKER_USER --password-stdin'
                        
                        // Tag and push API images
                        sh "docker tag ${API_IMAGE}:${BUILD_TAG} ${API_IMAGE}:latest"
                        sh "docker push ${API_IMAGE}:${BUILD_TAG}"
                        sh "docker push ${API_IMAGE}:latest"
                        
                        // Tag and push Web images
                        sh "docker tag ${WEB_IMAGE}:${BUILD_TAG} ${WEB_IMAGE}:latest"
                        sh "docker push ${WEB_IMAGE}:${BUILD_TAG}"
                        sh "docker push ${WEB_IMAGE}:latest"
                    }
                    
                    echo "Successfully pushed images to ${DOCKER_REGISTRY}"
                }
            }
        }
    }

    post {
        always {
            script {
                // Clean up built images
                sh "docker rmi ${API_IMAGE}:${BUILD_TAG} || true"
                sh "docker rmi ${API_IMAGE}:latest || true"
                sh "docker rmi ${WEB_IMAGE}:${BUILD_TAG} || true"
                sh "docker rmi ${WEB_IMAGE}:latest || true"
                
                // Prune unused Docker resources
                sh 'docker system prune -f || true'
            }
            cleanWs()
        }
        success {
            echo """
            ==========================================
            Pipeline completed successfully!
            ==========================================
            Branch: ${env.GIT_BRANCH_NAME}
            Commit: ${env.COMMIT_SHA}
            API Image: ${API_IMAGE}:${BUILD_TAG}
            Web Image: ${WEB_IMAGE}:${BUILD_TAG}
            ==========================================
            """
        }
        failure {
            echo """
            ==========================================
            Pipeline FAILED!
            ==========================================
            Branch: ${env.GIT_BRANCH_NAME}
            Commit: ${env.COMMIT_SHA}
            Check the logs for details.
            ==========================================
            """
        }
    }
}