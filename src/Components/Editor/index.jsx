import React, { useEffect, useContext, useRef, useState } from "react";
import { CodemirrorBinding } from "y-codemirror";
import { UnControlled as CodeMirrorEditor } from "react-codemirror2";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
// import { useLocation } from "react-router-dom";
// import { connect } from "react-redux";
// import {
//   SET_LOADING,
//   SET_OUTPUT,
//   SET_CODE,
//   SET_UPLOADED_CODE,
// } from "../../store/Action/action";
// import languageMapper from "../../Function/languageMapper";
import "./Editor.css";
import RandomColor from "randomcolor";
import "./EditorAddons";


export function Editor(props) {
  // const location = useLocation();
  const [EditorRef, setEditorRef] = useState(null);
  const [code, setCode] = useState("");
  // const socket = props.socket;

  //Setting the uploaded code


  //Setting the editor reference when editor gets mounted
  const handleEditorDidMount = (editor) => {
    setEditorRef(editor);
  };

  //Emitting the compile event to other users


  //Yjs based real-time connection and collaboration 
  useEffect(() => {
    // const searchParams = new URLSearchParams(location.search);
    //Collboration and connection starts after the editor is mounted
    if (EditorRef) {
      //Yjs document that holds shared data 
      const ydoc = new Y.Doc();

      let provider = null;
      try {
        //syncs the ydoc throught WebRTC connection
        provider = new WebrtcProvider(
          "getcodemirrorworking",
          ydoc,
          {
            signaling: [
              "wss://wii-code-y-webrtc.onrender.com",
            //   "ws://localhost:3123",
            ],
          //   password: location.state ? location.state.password : null,
          }
        );

        //Define a shared text type on the document
        const yText = ydoc.getText("codemirror");

        //Undomanager used for stacking the undo and redo operation for yjs
        const yUndoManager = new Y.UndoManager(yText);

        const awareness = provider.awareness;

        const color = RandomColor();
        //Awareness protocol is used to propagate your information (cursor position , name , etc)
        awareness.setLocalStateField("user", {
          name: "user"+color,
          color: color,
        });

        //Binds the Codemirror editor to Yjs text type
        const getBinding = new CodemirrorBinding(yText, EditorRef, awareness, {
          yUndoManager,
        });
      } catch (err) {
        alert(err + " error in collaborating try refreshing or come back later !");
      }
      return () => {
        //Releasing the resources used and destroying the document
        if (provider) {
          provider.disconnect();
          ydoc.destroy();
        }
      };
    }
  }, [EditorRef]);

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        width: "100%",
        fontSize: `16px`,
        overflowY: "auto",
      }}
    >
      <CodeMirrorEditor
        onChange={(editor, data, value) => {
          setCode(value);
        }}
        autoScroll
        options={{
          // mode: languageMapper("codemirror/mode/javascript/javascript"),
          // theme: props.tools.theme,
          lineWrapping: true,
          smartIndent: true,
          lineNumbers: true,
          foldGutter: true,
          tabSize: 2,
          gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
          autoCloseTags: true,
          matchBrackets: true,
          autoCloseBrackets: true,
          extraKeys: {
            "Ctrl-Space": "autocomplete",
          },
        }}
        editorDidMount={(editor) => {
          handleEditorDidMount(editor);
          editor.setSize("100vw", "100%");
        }}
      />
    </div>
  );
}

// const mapStateToProps = (state) => {
//   return {
//     ...state,
//   };
// };

// const mapDispatchToProps = (dispatch) => {
//   return {
//     setOutput: (value) => dispatch({ type: SET_OUTPUT, value }),
//     setLoading: () => dispatch({ type: SET_LOADING }),
//     setCode: (value) => dispatch({ type: SET_CODE, value }),
//     set_uploaded_code: (value) => dispatch({ type: SET_UPLOADED_CODE, value }),
//   };
// };

// export default connect(mapStateToProps, mapDispatchToProps)(Editor);
