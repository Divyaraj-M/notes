

1. How did you handle authentication between Salesforce and SurveySparrow (e.g., Named Credentials, OAuth, API keys)?

2. Did you use Apex (custom classes/triggers), External Services, or a different approach?

    If Apex: How did you structure the classes, callouts, and error handling?

    If External Services: How did you provide the OpenAPI schema and map actions in Flow?

3. Any special challenges around API limits, governor limits, or long-running transactions?

4. Did you leverage Batch Apex, Platform Events, or Streaming API? Why?

5. How do you handle bulk survey triggers or response mappings (hundreds or thousands at once)?

6. How do you prevent hitting Salesforce API call limits during large imports or exports?

7. Did you use Platform Events or Change Data Capture to decouple survey triggers from standard processes? 

8. Do they have api for the knwoledge articles and how much scalablity do they have?


### **Knowledge-Article Specific Workflows**

1. For Knowledge Articles: how do you choose when to trigger surveys (e.g., after help-center read, case resolution)?

2. How do you embed survey prompts in the Lightning Knowledge component or Classic article pages?

3. How do you capture context (article ID, user session info) so you can map feedback back to the right Article record?

4. If  am I palnning for future upgradations, what all are point to be considers now ? so that I break the right now Intgeration 