import React from 'react'
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { useEffect } from 'react';
import Check from '@mui/icons-material/Check';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import CancelIcon from '@mui/icons-material/Cancel';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Fade, Slide } from "react-awesome-reveal";
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import { Navigate, useNavigate } from 'react-router-dom';
import { getDatabase, ref,push } from "firebase/database";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Diversity1Icon from '@mui/icons-material/Diversity1';
const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#784af4',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#784af4',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

const QontoStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
  display: 'flex',
  height: 22,
  alignItems: 'center',
  ...(ownerState.active && {
    color: '#784af4',
  }),
  '& .QontoStepIcon-completedIcon': {
    color: '#784af4',
    zIndex: 1,
    fontSize: 18,
  },
  '& .QontoStepIcon-circle': {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
}));

function QontoStepIcon(props) {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <Check className="QontoStepIcon-completedIcon" />
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </QontoStepIconRoot>
  );
}

QontoStepIcon.propTypes = {
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,
};

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: 'linear-gradient(to top, #48c6ef 0%, #6f86d6 100%)',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: 'linear-gradient(to top, #48c6ef 0%, #6f86d6 100%)'
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
  zIndex: 1,
  color: 'white',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.active && {
    backgroundImage: 'linear-gradient(to top, #48c6ef 0%, #6f86d6 100%)',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  }),
  ...(ownerState.completed && {
    backgroundImage: 'linear-gradient(to top, #48c6ef 0%, #6f86d6 100%)'
  }),
}));

function ColorlibStepIcon(props) {
  const { active, completed, className } = props;

  const icons = {
    1: <AccountCircleIcon />,
    2: <LocalPharmacyIcon />,
    3: <Diversity1Icon />,
    4: <AssignmentIndIcon />,
  };

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

ColorlibStepIcon.propTypes = {
  /**
   * Whether this step is active.
    @default false
   
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,

  icon: PropTypes.node,
};


function Main() {
  const Navigate=useNavigate()
  const steps = ['Client Information', 'Medication list', 'Family Health History', 'Diet Questionnaires'];
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [PatientDetails, setPatientDetails] = React.useState(
    {
      Name: "", Email: "", Birthdate: "", Height_Weight: "", Address: "",
      detailedAddress: "", Phone: "", Work_phone: "", Gender: "", Maritalstatus: "", Children_details: "",
      Employer: "", Occupation: "", Contact: "", Relation: "", Emergency_Phone: "", HearAboutus: "", physician: "", Phone_no: ""
    }
  )
  const [Diagnosis, setDiagnois] = React.useState([
    { Current_Concern: '', Diagnosis_date: '', treated: '', Response: '' },
  ]);
  const [currentlist, setcurrentlist] = React.useState([
    { Medication: '', Strength: '', Reason: '' }
  ]);
  const [Health_history, sethealth_history] = React.useState([
    { Relation: '', Age: '', Condition: '' }
  ]);
  const [Diet_Questions, setDiet_Questions] = React.useState([
    { Meal: '', Variety: '', Quantity: '', Timing: '' }
  ]);
  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
    if (activeStep === 3) {
      setActiveStep(4)
      const db = getDatabase();
      const data=JSON.parse(localStorage.getItem('Patient-details'))
      push(ref(db, 'Patient-details/'), {
        PatientDetails,
        Diagnosis,
        currentlist,
        Patient_id:data.UID,
        Health_history,
        Diet_Questions
      });
      setTimeout(() => {
        setActiveStep(0)
      }, 2000)
    }
  };


  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  const handleAddField = () => {
    setDiagnois([...Diagnosis, { Current_Concern: '', Diagnosis_date: '', treated: '', Response: '' },]);
  };
  const handleAddField2 = () => {
    setcurrentlist([...currentlist, { Medication: '', Strength: '', Reason: '' }]);
  }
  const handleAddField3 = () => {
    sethealth_history([...Health_history, { Relation: '', Age: '', Condition: '' }])
  }
  const handleAddField4 = () => {
    setDiet_Questions([...Diet_Questions, { Meal: '', Variety: '', Quantity: '', Timing: '' }])
  }
  const Diet_questions_inputs = (index, inputValue, field) => {
    setDiet_Questions((prevInputs) => {
      const newInputs = [...prevInputs];
             newInputs[index][field] = inputValue;
      return newInputs;
    });
  };
  const Health_history_inputs = (index, inputValue, field) => {
    sethealth_history((prevInputs) => {
      const newInputs = [...prevInputs];
      newInputs[index][field] = inputValue;
      return newInputs;
    });
  };
  const handleDeleteInput = (index) => {
    setDiagnois((prevInputs) => {
      const newInputs = [...prevInputs];
      newInputs.splice(index, 1);
      return newInputs;
    });
  };
  const DiagnosisInputs = (index, inputValue, field) => {
    setDiagnois((prevInputs) => {
      const newInputs = [...prevInputs];
      newInputs[index][field] = inputValue;
      return newInputs;
    });
  };
  const CurrentlistInputs = (index, inputValue, field) => {
    setcurrentlist((prevInputs) => {
      const newInputs = [...prevInputs];
      newInputs[index][field] = inputValue;
      return newInputs;
    });
  };
  const HandlePatientDetails = (fieldName, value) => {
    setPatientDetails(prev => ({
      ...prev,
      [fieldName]: value

    }))
  };
  
  useEffect(()=>{
    if(!localStorage.getItem('Patient-details')){
      Navigate("/Login")
    }
   },[])

  return <div className='content-box'>
    <Box sx={{ width: '100%' }}>
      <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography variant="caption">Optional</Typography>
            );
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps} >
              <StepLabel StepIconComponent={ColorlibStepIcon} >
                <p id='step'>{label}</p></StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <>
          <div className='container'>

            <div className='client-basic-information'>
              <div className='last-section'>
                <Fade><img className='last-section-img'src='ayurailogofull.png'>

                </img>
                </Fade>
                <Slide><p id='last-section-p'>Thank you for choosing Ayur.AI</p></Slide>
              </div>
            </div>
          </div>

        </>
      ) : (
        <>
          {activeStep === 0 ? <div className='container'>
            <Fade>
              <div className='client-basic-information'>
                <div className='client-inputs'>
                  <div>
                    <p>Name</p>
                    <input type='text' id='name'
                      value={PatientDetails.Name}
                      onChange={(e) => {
                        HandlePatientDetails("Name", e.target.value)
                      }}></input>
                  </div>
                  <div>
                    <p>Email</p>
                    <input type='text' id='name'
                      value={PatientDetails.Email}
                      onChange={(e) => {
                        HandlePatientDetails("Email", e.target.value)
                      }}></input>
                  </div>
                  <div>
                    <p>Birth date</p>
                    <input type='date' id='name'
                      value={PatientDetails.Birthdate}
                      onChange={(e) => {
                        HandlePatientDetails("Birthdate", e.target.value)
                      }}></input>
                  </div>
                  <div>
                    <p>Height and Weight</p>
                    <input type='text' id='name'
                      value={PatientDetails.Height_Weight}
                      onChange={(e) => {
                        HandlePatientDetails("Height_Weight", e.target.value)
                      }}></input>
                  </div>
                  <div>
                    <p>Address</p>
                    <input type='text' id='name'
                      value={PatientDetails.Address}
                      onChange={(e) => {
                        HandlePatientDetails("Address", e.target.value)
                      }}></input>
                  </div>
                  <div>
                    <p>City, State, Zip:</p>
                    <input type='text' id='name'
                      value={PatientDetails.detailedAddress}
                      onChange={(e) => {
                        HandlePatientDetails("detailedAddress", e.target.value)
                      }}></input>
                  </div>       <div>
                    <p>Cell Phone</p>
                    <input type='text' id='name'
                      value={PatientDetails.Phone}
                      onChange={(e) => {
                        HandlePatientDetails("Phone", e.target.value)
                      }}></input>
                  </div>       <div>
                    <p>
                      Work Phone
                    </p>
                    <input type='text' id='name'
                      value={PatientDetails.Work_phone}
                      onChange={(e) => {
                        HandlePatientDetails("Work_phone", e.target.value)
                      }}></input>
                  </div>
                  <div>
                    <p>
                      Gender
                    </p>
                    <div style={{ display: 'flex', alignItems: "center", gap: "5px" }}>
                      <input type="radio" id="gender1" name="gender" value="Male" onClick={(e) => {
                        HandlePatientDetails("Gender", e.target.value)
                      }} />
                      <label for="gender1">Male</label>
                      <input type="radio" id="gender2" name="gender" value="Female" onClick={(e) => {
                        HandlePatientDetails("Gender", e.target.value)
                      }} />
                      <label for="gender2">Female</label>
                      <input type="radio" id="gender3" name="gender" value="Others" onClick={(e) => {
                        HandlePatientDetails("Gender", e.target.value)
                      }} />
                      <label for="gender3">Others</label>
                    </div>
                  </div>
                  <div>
                    <p>
                      Marital status
                    </p>
                    <select id='name'
                      value={PatientDetails.Maritalstatus}
                      onChange={(e) => {
                        HandlePatientDetails("Maritalstatus", e.target.value)
                      }}>
                      <option value='Single'>Single</option>
                      <option value='Married'>Married</option>
                      <option value='Divorced'>Divorced</option>
                      <option value='Widowed'>Widowed</option>
                    </select>
                  </div>
                  <div>
                    <p>
                      Children’s names/ages
                    </p>
                    <input type='text' id='name'
                      value={PatientDetails.Children_details}
                      onChange={(e) => {
                        HandlePatientDetails("Children_details", e.target.value)
                      }} ></input>
                  </div>
                  <div>
                    <p>
                      Employer
                    </p>
                    <input type='text' id='name'
                      value={PatientDetails.Employer}
                      onChange={(e) => {
                        HandlePatientDetails("Employer", e.target.value)
                      }}></input>
                  </div>
                  <div>
                    <p>
                      Occupation
                    </p>
                    <input type='text' id='name'
                      value={PatientDetails.Occupation}
                      onChange={(e) => {
                        HandlePatientDetails("Occupation", e.target.value)
                      }}></input>
                  </div>
                  <div>
                    <p>
                      Emergency contact
                    </p>
                    <input type='text' id='name'
                      value={PatientDetails.Contact}
                      onChange={(e) => {
                        HandlePatientDetails("Contact", e.target.value)
                      }}></input>
                  </div>
                  <div>
                    <p>
                      Relation
                    </p>
                    <input type='text' id='name'
                      value={PatientDetails.Relation}
                      onChange={(e) => {
                        HandlePatientDetails("Relation", e.target.value)
                      }}></input>
                  </div>
                  <div>
                    <p>
                      Emergency contact phone
                    </p>
                    <input type='text' id='name'
                      value={PatientDetails.Emergency_Phone}
                      onChange={(e) => {
                        HandlePatientDetails("Emergency_Phone", e.target.value)
                      }}></input>
                  </div>
                  <div>
                    <p>How did you hear about us</p>
                    <input type='text' id='name'
                      value={PatientDetails.HearAboutus}
                      onChange={(e) => {
                        HandlePatientDetails("HearAboutus", e.target.value)
                      }}></input>
                  </div>
                  <div>
                    <p>Primary care physician</p>
                    <input type='text' id='name' value={PatientDetails.physician} onChange={(e) => {
                      HandlePatientDetails("physician", e.target.value)
                    }}></input>
                  </div>
                  <div>
                    <p>Phone</p>
                    <input type='text' id='name' value={PatientDetails.Phone_no} onChange={(e) => {
                      HandlePatientDetails("Phone_no", e.target.value)
                    }}>

                    </input>
                  </div>
                </div>

              </div>
            </Fade>
          </div> : activeStep === 1 ?
            <div className='container'>
              <Fade>
                <div className='client-basic-information'>

                  <div className='Medication'>
                    <div className='diagnois'>
                      <p>Diagnosis</p>
                      {Diagnosis.map((input, index) => (
                        <div className='diagnois-list' key={index}>
                          <div >
                            <p>
                              Current Concern
                            </p>
                            <input type='text' id='name' value={input.Current_Concern} onChange={(event) => { DiagnosisInputs(index, event.target.value, "Current_Concern") }}></input>
                          </div>
                          <div>
                            <p>Approximate Date
                              of Diagnosis</p>
                            <input type='text' id='name' value={input.Diagnosis_date} onChange={(event) => { DiagnosisInputs(index, event.target.value, "Diagnosis_date") }}></input>
                          </div>
                          <div>
                            <p>Treatment
                              already Received</p>
                            <input type='text' id='name' value={input.treated} onChange={(event) => { DiagnosisInputs(index, event.target.value, "treated") }}></input>
                          </div>
                          <div>
                            <p>Response to treatment</p>
                            <input type='text' id='name' value={input.Response} onChange={(event) => { DiagnosisInputs(index, event.target.value, "Response") }}></input>
                          </div>
                          {index > 0 ? <div id='remove-btn' onClick={() => {
                            handleDeleteInput(index)
                          }}><CancelIcon style={{ fontSize: "medium", color: "red" }} /></div> : <></>}
                        </div>))}
                      <div className='add-more' onClick={handleAddField}>
                        Add more <AddCircleOutlineIcon />
                      </div>
                    </div>
                    <div className='Current-medication'>
                      <p style={{ marginTop: "1rem" }}>Current Medication </p>
                      {currentlist.map((input, index) => (
                        <div className='current-medication-list' key={index}>
                          <div>
                            <p>Name Of Medication</p>
                            <input type='text' id='name' value={input.Medication} onChange={(event) => CurrentlistInputs(index, event.target.value, "Medication")}></input>
                          </div>
                          <div>
                            <p>Strength</p>
                            <input type='text' id='name' value={input.Strength} onChange={(event) => CurrentlistInputs(index, event.target.value, "Strength")}></input>
                          </div>
                          <div>
                            <p>Reason</p>
                            <input type='text' id='name' value={input.Reason} onChange={(event) => CurrentlistInputs(index, event.target.value, "Reason")}></input>
                          </div>
                          
                        </div>
                        
                      ))}
                      <div className='add-more' onClick={handleAddField2}>
                        Add more <AddCircleOutlineIcon />
                      </div>
                    </div>
                  </div>

                </div>
              </Fade>
            </div> : activeStep === 2 ?
              <div className='container'>
                <Fade>
                  <div className='client-basic-information'>
                    <div className='Medication'>
                      <div className='Current-medication'>
                        <p style={{ marginTop: "1rem" }}>Family Health History </p>
                        {Health_history.map((input, index) => (
                          <div className='current-medication-list' key={index}>
                            <div>
                              <p>Relation</p>
                              <select id='name' value={input.Relation} onChange={(event) => Health_history_inputs(index, event.target.value, "Relation")}>
                                <option>Father</option>
                                <option>Mother</option>
                                <option>Grand Father</option>
                                <option>Grand Mother</option>
                                <option>Siblings</option>
                                <option>Others</option>
                              </select>
                            </div>
                            <div>
                              <p>Age</p>
                              <input type='text' id='name' value={input.Age} onChange={(event) => Health_history_inputs(index, event.target.value, "Age")}></input>
                            </div>
                            <div>
                              <p>Health Condition</p>
                              <input type='text' id='name' value={input.Condition} onChange={(event) => Health_history_inputs(index, event.target.value, "Condition")}></input>

                            </div>
                          </div>
                        ))}
                        <div className='add-more' onClick={handleAddField3}>
                          Add more <AddCircleOutlineIcon />
                        </div>
                        <p>List any Major Surgeries? </p>
                        <textarea></textarea>
                        <p>Exercise Routine </p>
                        <textarea rows={6}></textarea>
                      </div>
                    </div>

                  </div>
                </Fade>
              </div> : activeStep === 3 ? <div className='container'>
                <Fade>
                  <div className='client-basic-information'>
                    <div className='Medication'>
                      <div className='Current-medication'>
                        <p style={{ marginTop: "1rem" }}>Diet Questionnaire </p>
                        {Diet_Questions.map((input, index) => (
                          <div className='diet-question-list' key={index}>
                            <div>
                              <p>Meal</p>
                              <select id='name' value={input.Meal} onChange={(event) => Diet_questions_inputs(index, event.target.value, "Meal")}>
                                <option >Breakfast</option>
                                <option>Lunch</option>
                                <option>Snack</option>
                                <option>Dinner</option>
                                <option>Other timing</option>
                              </select>
                            </div>
                            <div>
                              <p>Variety</p>
                              <input type='text' id='name' value={input.Variety} onChange={(event) => Diet_questions_inputs(index, event.target.value, "Variety")}></input>
                            </div>
                            <div>
                              <p>Quantity</p>
                              <input type='text' id='name' value={input.Quantity} onChange={(event) => Diet_questions_inputs(index, event.target.value, "Quantity")}></input>

                            </div>
                            <div>
                              <p>Timing</p>
                              <input type='text' id='name' value={input.Timing} onChange={(event) => Diet_questions_inputs(index, event.target.value, "Timing")}></input>

                            </div>
                          </div>
                        ))}
                        <div className='add-more' onClick={handleAddField4}>
                          Add more <AddCircleOutlineIcon />
                        </div>
                        <p>Any other Relevant Information</p>
                        <textarea height={'10rem'}></textarea>

                      </div>
                    </div>
                  </div>
                </Fade>
              </div> : <></>}
          <div className='action-buttons'>
            <div className='action-buttons-box'>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />
              {isStepOptional(activeStep) && (
                <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                  Skip
                </Button>
              )}

              <Button onClick={handleNext} style={{ backgroundImage: 'linear-gradient(to top, #00c6fb 0%, #005bea 100%)', color: 'white' }}>
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </div>
          </div>
        </>
      )}
    </Box>
  </div>
}

export default Main