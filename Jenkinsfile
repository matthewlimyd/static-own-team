pipeline {
    agent any
    tools {
        nodejs 'NodeJS_20'
    }

    stages {
        stage('Install Dependencies for bookhaven-api') {
            steps {
                dir('bookhaven-react-master/bookhaven-api') {
                    sh 'npm install'
                }
            }
        }

        stage('Run Jest Tests for bookhaven-api') {
            steps {
                dir('bookhaven-react-master/bookhaven-api') {
                    sh 'npm test'
                }
            }
        }

        stage('Install Dependencies for webshop-app') {
            steps {
                dir('bookhaven-react-master/webshop-app') {
                    sh 'npm install'
                }
            }
        }

        stage('OWASP Dependency-Check Vulnerabilities') {
            steps {
                dependencyCheck additionalArguments: ''' 
                    -o './'
                    -s './'
                    -f 'ALL' 
                    --disableAssembly
                    --disableYarnAudit
                    --prettyPrint
                ''', odcInstallation: 'OWASP Dependency-Check Vulnerabilities'

                dependencyCheckPublisher pattern: 'dependency-check-report.xml'
            }
        }
    }
}
