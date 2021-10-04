import React from "react";
import "components/Appointment/styles.scss";
import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import Form from "components/Appointment/Form";
import Status from "components/Appointment/Status";
import Confirm from "components/Appointment/Confirm";
import Error from "components/Appointment/Error";
import useVisualMode from "hooks/useVisualMode";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETECONFIRM = "DELETECONFIRM";
const DELETING = "DELETING";
const EDIT = "EDIT";
const SAVE_ERROR = "SAVE_ERROR";
const DELETE_ERROR = "DELET_EERROR";

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(props.interview ? SHOW : EMPTY);

  const save = (name, interviewer) => {
    const interview = {
      student: name,
      interviewer: interviewer,
    };
    transition(SAVING);
    props
      .bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch((err) => {
        console.log("Appointment Save Error::", err);
        transition(SAVE_ERROR, true);
      });
  };

  const deleteAppointment = () => {
    transition(DELETING, true);
    props
      .cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch((err) => {
        console.log("Appointment Deletion Error::", err);
        transition(DELETE_ERROR, true);
      });
  };

  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SAVING && <Status message={"Saving.."} />}
      {mode === EDIT && (
        <Form
          interviewers={props.interviewers}
          interviewer={props.interview.interviewer.id}
          name={props.interview.student}
          onCancel={() => back(SHOW)}
          onSave={save}
        />
      )}
      {mode === DELETECONFIRM && (
        <Confirm
          message={"Are you sure you would like to delete?"}
          onCancel={() => back()}
          onConfirm={() => deleteAppointment(props.id)}
        />
      )}
      {mode === DELETING && <Status message={"Deleting.."} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={() => transition(DELETECONFIRM)}
          onEdit={() => transition(EDIT)}
        />
      )}
      {mode === CREATE && <Form interviewers={props.interviewers} onCancel={() => back(EMPTY)} onSave={save} />}
      {mode === DELETE_ERROR && <Error message={"Warning! Could not delete interview."} onClose={() => back()} />}
      {mode === SAVE_ERROR && <Error message={"Warning! Could not save interview."} onClose={() => back()} />}
    </article>
  );
}
