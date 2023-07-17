"use client";
import Peer from "peerjs";
import { useEffect, useRef, useState } from "react";
export default function MeetSession() {
  const [peerID, setPeerID] = useState("");
  const peerRef = useRef();
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const [connected, setConnected] = useState(false);
  useEffect(() => {
    let userMediaStream;
    async function getMedia() {
      try {
        userMediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        localVideoRef.current.srcObject = userMediaStream;
        localVideoRef.current.play();
      } catch (err) {
        console.log(err);
      }
    }
    getMedia();

    peerRef.current = new Peer();
    peerRef.current.on("open", (id) => {
      setPeerID(id);
    });
    peerRef.current.on("call", (call) => {
      call.answer(userMediaStream);
      call.on("stream", (remoteStream) => {
        remoteVideoRef.current.srcObject = remoteStream;
        remoteVideoRef.current.play();
        setConnected(true);
      });
    });

    // on remote peer disconnect
    peerRef.current.on("close", () => {
      console.log("disconnected");
      remoteVideoRef.current.srcObject = null;
    });
    peerRef.current.on("error", () => {
      console.log("disconnected");
      remoteVideoRef.current.srcObject = null;
    });
  }, []);

  const callPeer = (e) => {
    e.preventDefault();
    const peerID = document.getElementById("peerID").value;
    const call = peerRef.current.call(peerID, localVideoRef.current.srcObject);
    call.on("stream", (remoteStream) => {
      remoteVideoRef.current.srcObject = remoteStream;
      remoteVideoRef.current.play();
      setConnected(true);
    });
  };
  const muteAudio = () => {
    const enabled = localVideoRef.current.srcObject.getAudioTracks()[0].enabled;
    if (enabled) {
      localVideoRef.current.srcObject.getAudioTracks()[0].enabled = false;
    } else {
      localVideoRef.current.srcObject.getAudioTracks()[0].enabled = true;
    }
  };

  const videoOff = () => {
    const enabled = localVideoRef.current.srcObject.getVideoTracks()[0].enabled;
    if (enabled) {
      localVideoRef.current.srcObject.getVideoTracks()[0].enabled = false;
    } else {
      localVideoRef.current.srcObject.getVideoTracks()[0].enabled = true;
    }
  };
  return (
    <div className="justify-center flex flex-col">
      <p className="text-5xl font-bold text-center">Meet Session</p>
      <br />
      <p className="text-3xl text-center">Your Peer ID: {peerID}</p>
      <button
        onClick={() => {
          navigator.clipboard.writeText(peerID);
        }}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold w-40 py-2 px-4 rounded mx-auto text-center"
      >
        Copy Peer ID
      </button>
      <div className="justify-center flex flex-col">
        {/* create a video grid of two video elements */}
        <div className="flex flex-row justify-center items-center">
          <div className="flex flex-col justify-center items-center m-4">
            <video
              className="w-96 h-72"
              autoPlay
              playsInline
              id="localVideo"
              ref={localVideoRef}
              muted
            ></video>
            <p className="text-2xl text-center">Local Video</p>
          </div>
          <div className="flex flex-col justify-center items-center m-4">
            <video
              className="w-96 h-72"
              autoPlay
              playsInline
              id="localVideo"
              ref={remoteVideoRef}
            ></video>
            <p className="text-2xl text-center">Remote Video</p>
          </div>
        </div>
        <div className="flex flex-row justify-center items-center">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold w-40 py-2 px-4 rounded mx-auto"
            onClick={muteAudio}
          >
            Mute Audio
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold w-40 py-2 px-4 rounded mx-auto"
            onClick={videoOff}
          >
            Video Off
          </button>
        </div>
        {!connected && (
          <form
            className="flex flex-col justify-center items-center m-4"
            onClick={callPeer}
          >
            <label className="text-2xl text-center">Enter Peer ID:</label>
            <input
              className="w-96 h-12 text-2xl text-center border-2 border-gray-400 rounded m-4"
              type="text"
              id="peerID"
            />
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold w-40 py-2 px-4 rounded mx-auto"
              type="submit"
            >
              Connect
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
