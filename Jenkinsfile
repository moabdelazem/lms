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
        TRIVY_EXIT_CODE = '1'  // Fail on critical vulnerabilities
        DOCKER_BUILDKIT = '1'
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
                NPM_CONFIG_CACHE = "${WORKSPACE}/.npm-cache"
                HOME = "${WORKSPACE}"
            }
            steps {
                dir('api') {
                    sh 'npm ci --prefer-offline'
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
                            sh """
                                docker build \
                                    --build-arg BUILDKIT_INLINE_CACHE=1 \
                                    --cache-from ${API_IMAGE}:latest \
                                    -t ${API_IMAGE}:${BUILD_TAG} \
                                    -f api/Dockerfile api
                            """
                        }
                    }
                }
                stage('Build Web Image') {
                    steps {
                        script {
                            sh """
                                docker build \
                                    --build-arg BUILDKIT_INLINE_CACHE=1 \
                                    --build-arg VITE_API_URL=/api \
                                    --cache-from ${WEB_IMAGE}:latest \
                                    -t ${WEB_IMAGE}:${BUILD_TAG} \
                                    -f web/Dockerfile web
                            """
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
            steps {
                script {
                    withCredentials([usernamePassword(
                        credentialsId: "${DOCKER_CREDENTIALS}",
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )]) {
                        // Use double quotes to ensure variable expansion
                        sh "echo \"\${DOCKER_PASS}\" | docker login ${DOCKER_REGISTRY} -u \"\${DOCKER_USER}\" --password-stdin"
                        
                        echo "Docker login successful, pushing images..."
                        
                        // Tag and push API images with retry
                        retry(3) {
                            sh "docker tag ${API_IMAGE}:${BUILD_TAG} ${API_IMAGE}:latest"
                            sh "docker push ${API_IMAGE}:${BUILD_TAG}"
                            sh "docker push ${API_IMAGE}:latest"
                        }
                        
                        // Tag and push Web images with retry
                        retry(3) {
                            sh "docker tag ${WEB_IMAGE}:${BUILD_TAG} ${WEB_IMAGE}:latest"
                            sh "docker push ${WEB_IMAGE}:${BUILD_TAG}"
                            sh "docker push ${WEB_IMAGE}:latest"
                        }
                        
                        // Logout after push
                        sh "docker logout ${DOCKER_REGISTRY}"
                    }
                    
                    echo "Successfully pushed images to ${DOCKER_REGISTRY}"
                }
            }
        }
    }

    post {
        always {
            script {
                // Only remove build-specific tags, KEEP :latest for cache
                sh "docker rmi ${API_IMAGE}:${BUILD_TAG} || true"
                sh "docker rmi ${WEB_IMAGE}:${BUILD_TAG} || true"
                
                sh 'docker image prune -f --filter "until=24h" || true'
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
