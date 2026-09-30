/**
 * Entry for the same-origin Poster3D vendor bundle loaded by the sandbox iframe.
 * React / react-dom are externalized to the same esm.sh URLs as main.js / runtime.js.
 */
import * as THREE from "three";
import * as fiber from "@react-three/fiber";
import * as drei from "@react-three/drei";
import * as postprocessing from "@react-three/postprocessing";
import * as csg from "@react-three/csg";
import * as spring from "@react-spring/three";
import * as gesture from "@use-gesture/react";
import * as maath from "maath";
import * as leva from "leva";
import * as theatre from "@theatre/core";
import * as theatreR3f from "@theatre/r3f";
import { Canvas3D } from "./Canvas3D.jsx";

export const Poster3D = {
  THREE,
  fiber,
  drei,
  postprocessing,
  csg,
  spring,
  gesture,
  maath,
  leva,
  theatre,
  theatreR3f,
  Canvas3D,
};

export default Poster3D;
