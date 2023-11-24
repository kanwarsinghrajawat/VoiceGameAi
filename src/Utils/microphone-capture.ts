import { AudioCaptureStreamingService } from "./audio-services";
let websocketSendUrl, websocketReceiveUrl, jwtToken: any, websocket: any;

//Configuring the request body to the API
let request = {
  sessions: [
    {
      asyncMode: "REAL-TIME",
      websocket: { adHoc: true, minimumDelay: 0, useSTOMP: false },
      continuousRecognition: {
        enable: true,
        stopOn: ["ERROR"],
        noResponseFor: ["INPUT-STARTED", "NOINPUT"],
      },
    },
  ],
  audio: {
    source: { stream: { protocol: "WEBSOCKET" } },
    format: "F32",
    rate: 16000,
    channels: "mono",
    capture: true,
  },
  settings: {
    asr: {
      confidenceThreshold: 0.175,
      noInputTimeout: 9000,
      incompleteTimeout: 2500,
      completeTimeout: 100,
      sensitivity: 0.1,
      grammars: [
        {
          type: "JJSGF",
          parameters: { "tag-format": "semantics/1.0-literals" },
          grammar: "command",
          public: {
            root: "<first> {first} | <second> {second} | <third> {third} | <fourth> {fourth} | <fifth> {fifth} | <sixth> {sixth}",
          },
          rules: {
            first:
              "((first alt phrase of first command) | (second alt phrase of first command))",
            second:
              "((first alt phrase of second command) | (second alt phrase of second command))",
            third:
              "((first alt phrase of third command) | (second alt phrase of third command))",
            fourth:
              "((first alt phrase of fourth command) | (second alt phrase of fourth command))",
            fifth:
              "((first alt phrase of fifth command) | (second alt phrase of fifth command))",
            sixth:
              "((first alt phrase of sixth command) | (second alt phrase of sixth command))",
          },
        },
      ],
    },
  },
};

// sending the command
let data: string = "";
function setData(newData: string) {
  data = newData;
}
export function getData() {
  let dataToReturn = data;
  setData("");
  return dataToReturn;
}

// Passign the grammar
function updateGrammar() {
  let command = request.settings.asr.grammars[0].rules;

  const semiStringOne = "Up";
  if (semiStringOne.trim().length > 1) {
    command.first = semiStringOne;
  } else command.first = `<VOID>`;

  const semiStringTwo = "Down";
  if (semiStringTwo.trim().length > 1) {
    command.second = semiStringTwo;
  } else command.second = `<VOID>`;

  const semiStringThree = "Left";
  if (semiStringThree.trim().length > 1) {
    command.third = semiStringThree;
  } else command.third = `<VOID>`;

  const semiStringFour = "Right";
  if (semiStringFour.trim().length > 1) {
    command.fourth = semiStringFour;
  } else command.fourth = `<VOID>`;

  const semiStringFive = "Go";
  if (semiStringFive.trim().length > 1) {
    command.fifth = semiStringFive;
  } else command.fifth = `<VOID>`;

  const semiStringSix = "Stop";
  if (semiStringSix.trim().length > 1) {
    command.sixth = semiStringSix;
  } else command.sixth = `<VOID>`;

  console.log("Request first tag: " + command.first);
}

// make call to Voicegain API to get websocket URLs
export const connectWebsocket = async () => {
  const audioContext = new AudioContext();
  const websocketApiUrl = new URL(
    "https://api.voicegain.ai/v1/asr/recognize/async"
  );
  try {
    // if (fetchTempJwtResponse.ok) {
    jwtToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIyMjIwYTZkMC1iMzRiLTRmNzAtYmEyMi0zODgxOTkwN2JlY2EiLCJhdWQiOiJodHRwczovL2FwaS52b2ljZWdhaW4uYWkvdjEiLCJzdWIiOiI3ZGJiZGYzMy1jZGUyLTRlYTYtOTNmYi0yOTVlZmRlMDgzNTQifQ.8nMlXsm7QkDr7JaeT-xPGA7tAhY1_oMhip-HrLuwxgM";
    const fetchWebsocketUrl = async () => {
      const bearer = "Bearer " + jwtToken;
      updateGrammar();
      const body = JSON.stringify(request);
      // console.log("Request body: " + body);
      const options = {
        body,
        method: "POST",
        headers: {
          Authorization: bearer,
          "Content-Type": "application/json",
        },
      };
      try {
        let fetchWebsocketResponse = await fetch(
          websocketApiUrl.toString(),
          options
        );
        console.log("Yay!! ", fetchWebsocketResponse);
        if (fetchWebsocketResponse.ok) {
          let fetchWebsocketData = await fetchWebsocketResponse.json();
          websocketSendUrl = fetchWebsocketData.audio.stream.websocketUrl; //streams audio to the recognizer
          websocketReceiveUrl = fetchWebsocketData.sessions[0].websocket.url; //receives results
          console.log(
            "Data ",
            websocketSendUrl,
            websocketReceiveUrl,
            AudioCaptureStreamingService
          );
          startMicrophoneCapture(websocketSendUrl, websocketReceiveUrl);
        }
      } catch (err: any) {
        window.alert("Unable to start capture.");
        console.log(err.message);
      } finally {
        //   showLoader(false);
      }
    };

    fetchWebsocketUrl();
    // } else throw new Error("Unable to fetch temporary JWT token.");
  } catch (err: any) {
    window.alert("Unable to fetch temporary JWT token.");
    console.log(err.message);
  } finally {
    audioContext.close();
  }
};

//Start audio capturing services using microphone input
const startMicrophoneCapture = (
  websocketSendUrl: any,
  websocketReceiveUrl: any
) => {
  console.log("Lop ", AudioCaptureStreamingService);
  AudioCaptureStreamingService.start(websocketSendUrl);

  //Connect to websocket to receive result data
  const socket = new WebSocket(websocketReceiveUrl);
  socket.onopen = () => {
    console.log("Websocket is connected");
    socket.addEventListener("message", (event) => {
      let currentDate = new Date();
      console.log("At " + currentDate + " Websocket message: " + event.data);
      const jsonData = JSON.parse(event.data);

      //Processing grammar websocket results
      const interpretGrammarMessage = (message: any) => {
        //console.log(message, "dfghjk");
        try {
          if (message.lastEvent === "RECOGNITION-COMPLETE") {
            console.log("recognition is complete");
            //If a word in the grammar has MATCHED
            if (message.status == "MATCH") {
              console.log("MATCH ", message.alternatives[0].utterance);
              setData(message.alternatives[0].utterance);
            } else if (message.status == "NOMATCH") {
              console.log("NOMATCH");
            } else console.log("In else");
          } else if (message.lastEvent !== "RECOGNITION-COMPLETE") {
            console.log("Error getting real-time grammar results.");
          } else console.log("Unable to obtain grammar.");
        } catch (err: any) {
          console.log(err.message);
        }
      };

      interpretGrammarMessage(jsonData);
    });
  };
};

// Stop audio capturing services
export const stopMicrophoneCapture = () => {
  console.log("Getting stopped....");
  AudioCaptureStreamingService.stop();
  if (websocket !== undefined) {
    websocket.close();
    websocket = undefined;
    AudioCaptureStreamingService.stop();
  }
};
