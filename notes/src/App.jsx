import Note from "./components/Note";
import Notification from "./components/Notification";
import Footer from "./components/Footer";
import { useState, useEffect } from "react";
import noteService from "./services/notes";

const App = (props) => {
  const [notes, setNotes] = useState([]);
  // const [notes, setNotes] = useState(props.notes); //Saves notes in a state
  const [newNote, setNewNote] = useState("");
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  // this runs once when the component loads (because the dependency array is empty)
  // it gets all notes from the server and saves them in state

  useEffect(() => {
    noteService.getAll().then((initialNotes) => {
      setNotes(initialNotes);
    });
  }, []);

  // this function toggles the "important" value of a specific note
  const toggleImportanceOf = (id) => {
    // find the note with the matching id
    const note = notes.find((n) => n.id === id);
    // make a copy of the note but flip its "important" property
    const changedNote = { ...note, important: !note.important };

    //   // update the note on the server
    //   noteService.update(id, changedNote).then((response) => {
    //     // update the state with the new version of the note
    //     setNotes(notes.map((note) => (note.id === id ? response.data : note)));
    //   });
    // };

    noteService
      .update(id, changedNote)
      .then((returnedNote) => {
        setNotes(notes.map((note) => (note.id !== id ? note : returnedNote)));
      })
      .catch((error) => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        );
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        setNotes(notes.filter((n) => n.id !== id));
      });
  };

  // this function adds a new note to the list
  const addNote = (event) => {
    event.preventDefault(); // prevents the form from refreshing the page

    // create a new note object with random importance
    const noteObject = {
      content: newNote,
      important: Math.random() > 0.5,
    };

    noteService.create(noteObject).then((returnedNote) => {
      setNotes(notes.concat(returnedNote));
      setNewNote("");
    });
  };

  // send the new note to the server and update the state with it
  //   noteService.create(noteObject).then((response) => {
  //     setNotes(notes.concat(response.data));
  //     setNewNote(""); // clears the input field after adding
  //   });
  // };

  const handleNoteChange = (event) => {
    //Handles new values
    console.log(event.target.value);
    setNewNote(event.target.value);
  };

  // const notesToShow = showAll
  //   ? notes
  //   : notes.filter((note) => note.important === true);

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <ul>
        {notes.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />

        <button type="submit">Add Comment</button>
      </form>
      <Footer />
    </div>
  );
};

export default App;
