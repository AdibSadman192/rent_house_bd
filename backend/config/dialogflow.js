const dialogflow = require('@google-cloud/dialogflow');
const { v4: uuidv4 } = require('uuid');

// Initialize Dialogflow client
const sessionClient = new dialogflow.SessionsClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

const projectId = process.env.DIALOGFLOW_PROJECT_ID;

const detectIntent = async (text, sessionId = uuidv4()) => {
  const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text,
        languageCode: 'en-US',
      },
    },
  };

  try {
    const [response] = await sessionClient.detectIntent(request);
    const result = response.queryResult;

    return {
      text: result.fulfillmentText,
      intent: result.intent.displayName,
      confidence: result.intentDetectionConfidence,
      parameters: result.parameters.fields,
      action: result.action,
      allRequiredParamsPresent: result.allRequiredParamsPresent,
    };
  } catch (error) {
    console.error('Error detecting intent:', error);
    throw error;
  }
};

const trainModel = async (examples) => {
  const intentsClient = new dialogflow.IntentsClient({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  });

  const formattedParent = intentsClient.projectAgentPath(projectId);

  try {
    const [response] = await intentsClient.listIntents({
      parent: formattedParent,
    });

    const trainingPromises = examples.map(async (example) => {
      const matchingIntent = response.find(
        (intent) => intent.displayName === example.intent
      );

      if (matchingIntent) {
        // Update existing intent
        matchingIntent.trainingPhrases.push({
          parts: [{ text: example.text }],
        });

        const request = {
          intent: matchingIntent,
        };

        await intentsClient.updateIntent(request);
      } else {
        // Create new intent
        const intent = {
          displayName: example.intent,
          trainingPhrases: [
            {
              parts: [{ text: example.text }],
            },
          ],
          messages: [
            {
              text: {
                text: [example.response],
              },
            },
          ],
        };

        const request = {
          parent: formattedParent,
          intent,
        };

        await intentsClient.createIntent(request);
      }
    });

    await Promise.all(trainingPromises);
    return { success: true, message: 'Training completed successfully' };
  } catch (error) {
    console.error('Error training model:', error);
    throw error;
  }
};

module.exports = {
  detectIntent,
  trainModel,
};
