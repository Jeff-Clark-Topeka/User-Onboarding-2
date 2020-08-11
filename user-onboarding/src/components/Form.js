import React, { useState, useEffect } from "react";
import axios from 'axios'
import * as yup from 'yup';


const Form = () => {

    const [post, setPost] = useState([])

    const [serverError, setServerError] = useState('')

    const [formState, setFormState] = useState({
        
        name: '',
        email: '',
        password: '',
        terms: false

    })

    const [errors, setErrors] = useState({
        
        name: '',
        email: '',
        password: '',
        terms: '',

    })

    const validateChange = e => {
        yup
        .reach(formSchema, e.target.name)
        .validate(e.target.value)
        .then(valid => {
            setErrors({
                ...errors,
                [e.target.name]: ''
            });
        })
        .catch(err => {
            setErrors({
                ...errors,
                [e.target.name]: err.errors[0]
            });
        })
    };

    const [buttonDisabled, setButtonDisabled] = useState(true);

    const formSchema = yup.object().shape({
        name: yup
        .string()
        .required('Name is a required field.'),
        email: yup
        .string()
        .email('Must be a valid email address.')
        .required('Must include an Email address.'),
        password: yup
        .string()
        .required('A valid Password is required.'),
        terms: yup
        .boolean()
        .oneOf([true], 'Please agree to Terms of Service.')
    });

    useEffect(() => {
        formSchema.isValid(formState).then(valid => {
            setButtonDisabled(!valid)
        });
    }, [formState]);

    const inputChange = e => {
        e.persist();

        let checkedValue = true

        if (e.target.name === 'terms'){
            checkedValue = e.target.checked;
        }   else {
            checkedValue = formState.terms;
        }
         

        const newFormData = {
            ...formState,
            terms: checkedValue,
            [e.target.name]: 
            e.target.name === 'terms' ? e.target.checked : e.target.value
        };
        
        validateChange(e);
        setFormState(newFormData);
    };

    const postSubmit = e => {
        
        e.preventDefault()
        
        axios
        .post('https://reqres.in/api/users', formState)
        .then(res => {
            setPost(res.data);
            console.log('success', post);
            setFormState({
                name: '',
                email: '',
                password: '',
                terms: false,
            })

            setServerError(null);
        })
        .catch(err => {
            setServerError('There has been an error');
        });
    }

    return (
        <form onSubmit={postSubmit}>
            {serverError ? <p>{serverError}</p> : null }
            <div>
                <label htmlFor='name'>
                    Name
                    <input id='name' type='text' name='name' value={formState.name} onChange={inputChange} />
                    {errors.name.length > 0 ? <p>{errors.name}</p> : null}
                </label>
            </div>
            <br />
            <div>
                <label htmlFor='email'>
                    Email
                    <input id='email' type='email' name='email' value={formState.email} onChange={inputChange} />
                    {errors.email.length > 0 ? <p>{errors.email}</p> : null}
                </label>
            </div>
            <br />
            <div>
                <label htmlFor='password'>
                    Password
                    <input id='password' type='text' name='password' value={formState.password} onChange={inputChange} />
                    {errors.password.length > 0 ? <p>{errors.password}</p> : null}
                </label>
            </div>
            <br />
            <div>
                <label htmlFor='terms'>
                    <input id='terms' type='checkbox' name='terms' value={formState.terms} onChange={inputChange} />
                    Terms and Conditions  
                </label>
            </div>
            <br />
            <div>
                <pre>{JSON.stringify(post, null, 2)}</pre>
                <button disabled={buttonDisabled} type='submit'>Submit</button>
            </div>
        </form>
    )

}

export default Form;