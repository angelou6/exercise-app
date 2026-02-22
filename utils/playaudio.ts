import { AudioPlayer } from "expo-audio";

export default function playaudio(audio: AudioPlayer) {
  audio.seekTo(0);
  audio.play();
}
