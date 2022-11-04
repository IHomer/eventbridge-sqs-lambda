import {AWS} from "@serverless/typescript";

const serverlessConfiguration: AWS = {
    service: "eventbridge-sqs-lambda",
    frameworkVersion: "3",
    provider: {
        name: "aws",
        runtime: "nodejs16.x",
        region: "eu-central-1"
    },
    plugins: [
        'serverless-plugin-typescript',
    ],
    functions: {
        eventbridgeSqsLambda: {
            handler: `./handler.main`,
            events: [
                {
                    sqs: {
                        arn: {
                            'Fn::GetAtt': ['Queue', 'Arn']
                        }
                    }
                }
            ]
        }
    },
    resources: {
        Resources: {
            Queue: {
                Type: 'AWS::SQS::Queue'
            },
            EventRule: {
                Type: 'AWS::Events::Rule',
                Properties: {
                    Description: 'EventRule',
                    Name: 'EventbridgeToQueue',
                    EventPattern: {
                        source: [
                            {
                                prefix: 'example-prefix'
                            }
                        ]
                    },
                    Targets: [
                        {
                            Arn: {
                                'Fn::GetAtt': ['Queue', 'Arn']
                            },
                            Id: 'SQSqueue'
                        }
                    ]
                }
            },
            EventBridgeToToSqsPolicy: {
                Type: 'AWS::SQS::QueuePolicy',
                Properties: {
                    PolicyDocument: {
                        Statement: [
                            {
                                Effect: 'Allow',
                                Principal: {
                                    Service: 'events.amazonaws.com'
                                },
                                Action: 'SQS:SendMessage',
                                Resource: {
                                    'Fn::GetAtt': ['Queue', 'Arn']
                                }
                            }
                        ]
                    },
                    Queues: [
                        {
                            Ref: 'Queue'
                        }
                    ]
                }
            }
        }
    }
}


module.exports = serverlessConfiguration;
