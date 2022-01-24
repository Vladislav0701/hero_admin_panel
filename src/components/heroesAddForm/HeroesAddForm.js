import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from 'yup';
import { v4 as uuidv4 } from 'uuid';

import { useHttp } from "../../hooks/http.hook";
import { fetchFilters, selectAll } from "../../components/heroesFilters/filtersSlice";
import { heroCreated } from "../heroesList/heroesSlice";
import store from "../../store";

const HeroesAddForm = () => {
    const {request} = useHttp();
    const dispatch = useDispatch();
    const filters = selectAll(store.getState());
    const {filtersLoadingStatus} = useSelector(state => state.filters);

    useEffect(() => {
        dispatch(fetchFilters());
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onHeroCreated = ({name, description, element}) => {
        let newHero = {
            id: uuidv4(),
            name: name,
            description: description,
            element: element
        }

        request("http://localhost:3001/heroes", "POST", JSON.stringify(newHero))
            .then(dispatch(heroCreated(newHero)))
            .catch(err => console.log(err))
    }

    if (filtersLoadingStatus === "loading") {
        return <option>Загрузка элементов</option>
    } else if (filtersLoadingStatus === "error") {
        return <option>Ошибка загрузки</option>
    }

    const renderFilters = (filters) => {

        if (filters && filters.length > 0) {
            return filters.map(({label, element}) => {
                // eslint-disable-next-line array-callback-return
                if (element === "all") return;

                return <option key={element} value={element}>{label}</option>
            })
        } 
    }

    return (
        <Formik
            initialValues = {{
                name: '',
                description: '',
                element: ''
            }}
            validationSchema = {yup.object({
                name: yup.string().min(2, 'Введите минимум два символа!').required('Поле обязательно для ввода!'),
                description: yup.string().min(2, 'Введите минимум два символа!').required('Поле обязательно для ввода!'),
                element: yup.string().required('Выберите один из вариантов!')
            })}
            onSubmit={(values, action) => {
                onHeroCreated(values);
                action.resetForm({});
                }}>
                
            {({ isSubmitting }) => (
                <Form className="border p-4 shadow-lg rounded">
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                        <Field 
                            required
                            type="text" 
                            name="name" 
                            className="form-control" 
                            id="name" 
                            placeholder="Как меня зовут?"/>
                            <ErrorMessage className="form_error" component="div" name="name" />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="text" className="form-label fs-4">Описание</label>
                        <Field
                            as="textarea"
                            required
                            name="description" 
                            className="form-control" 
                            id="text" 
                            placeholder="Что я умею?"
                            style={{"height": '130px'}}/>
                            <ErrorMessage className="form_error" component="div" name="description" />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                        <Field
                            as="select" 
                            required
                            className="form-select" 
                            id="element" 
                            name="element">
                            <option>Я владею элементом...</option>
                            {renderFilters(filters)}
                        </Field>
                        <ErrorMessage className="form_error" component="div" name="element" />
                    </div>

                    <button disabled={isSubmitting} type="submit" className="btn btn-primary">Создать</button>
                </Form>
            )}
        </Formik>
    )
}

export default HeroesAddForm;