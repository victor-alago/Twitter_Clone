import React, { useState, useEffect } from "react";
import LeftSideBar from "../../components/leftSideBar/LeftSideBar";
import RightSideBar from "../../components/rightSideBar/RightSideBar";
import Tweet from "../../components/tweet/Tweet";
import EditProfile from "../../components/editProfile/EditProfile";
import axios from "axios";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
