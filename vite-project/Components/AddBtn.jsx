import React, { useState } from 'react'
import '../Styling/AddBtn.css'
export const AddBtn = () => {

    const [values,setValues]=useState({
        firstname:'',
        lastname:'',
        department:'',
        designation:'',
        email:'',
        phone:'',
        startdate:''
    })

    const handleChange=(e)=>{
        setValues({...values,[e.target.name]:[e.target.value]})
    }

    const handleSubmit=(e)=>{
        //prevent default subission of the form 
        e.preventDefault()
        console.log(values)
    }
  return (
    // <div className='container'>
    <>
        <h2>Add Employee Details</h2>
        <form action="" onSubmit={handleSubmit}>
            <label htmlFor="firstname">First Name:</label>
            <input type="text" placeholder='Enter First Name' name="firstname" onChange={(e)=>handleChange(e)} />

            <label htmlFor="lastname">Last Name:</label>
            <input type="text" placeholder='Enter Last Name'  name="lastname" onChange={(e)=>handleChange(e)} />

            <label htmlFor="department">Department:</label>
            <input type="text" placeholder='Enter your department' name="department" onChange={(e)=>handleChange(e)} />

            <label htmlFor="designation">Designation:</label>
            <input type="text" placeholder='Enter your Designation' name="designation" onChange={(e)=>handleChange(e)} />

            <label htmlFor="email">Email:</label>
            <input type="email" placeholder='Enter your Email' name="email" onChange={(e)=>handleChange(e)} />

            <label htmlFor="phone">Phone Number:</label>
            <input type="text" placeholder='Enter your Number' name="phone" onChange={(e)=>handleChange(e)} />

            <label htmlFor="startdate">Start Date:</label>
            <input type="date" placeholder='Enter Start Date' name="startdate" onChange={(e)=>handleChange(e)} />

 
            <button>Submit</button>

        </form>
        </>
    // {/* </div> */}
  )
}
