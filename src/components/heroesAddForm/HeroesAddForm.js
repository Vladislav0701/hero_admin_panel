import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHttp } from "../../hooks/http.hook";
import { v4 as uuidv4 } from 'uuid';

import { fetchFilters } from "../../components/heroesFilters/filtersSlice";
import { heroCreated } from "../heroesList/heroesSlice";

const HeroesAddForm = () => {
    const [heroName, setHeroName] = useState("");
    const [heroDescr, setHeroDescr] = useState("");
    const [heroElement, setHeroElement] = useState("");
    const dispatch = useDispatch();
    const {filters, filtersLoadingStatus} = useSelector(state => state.filters);
    const {request} = useHttp();

    useEffect(() => {
        dispatch(fetchFilters());
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onHeroCreated = (e) => {
        e.preventDefault();
        let newHero = {
            id: uuidv4(),
            name: heroName,
            description: heroDescr,
            element: heroElement
        }
        request("http://localhost:3001/heroes", "POST", JSON.stringify(newHero))
            .then(dispatch(heroCreated(newHero)))
            .catch(err => console.log(err))
            
        setHeroName('');
        setHeroDescr('');
        setHeroElement('');
    }

    if (filtersLoadingStatus === "loading") {
        return <option>Загрузка элементов</option>
    } else if (filtersLoadingStatus === "error") {
        return <option>Ошибка загрузки</option>
    }

    const renderFilters = (filters, status) => {

        if (filters && filters.length > 0) {
            return filters.map(({label, element}) => {
                // eslint-disable-next-line array-callback-return
                if (element === "all") return;

                return <option key={element} value={element}>{label}</option>
            })
        } 
    }  

    return (
        <form className="border p-4 shadow-lg rounded" onSubmit={onHeroCreated}>
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                <input 
                    required
                    type="text" 
                    name="name" 
                    className="form-control" 
                    id="name" 
                    placeholder="Как меня зовут?"
                    value={heroName}
                    onChange={(e) => setHeroName(e.target.value)}/>
            </div>

            <div className="mb-3">
                <label htmlFor="text" className="form-label fs-4">Описание</label>
                <textarea
                    required
                    name="text" 
                    className="form-control" 
                    id="text" 
                    placeholder="Что я умею?"
                    style={{"height": '130px'}}
                    value={heroDescr}
                    onChange={(e) => setHeroDescr(e.target.value)}/>
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                <select 
                    required
                    className="form-select" 
                    id="element" 
                    name="element"
                    value={heroElement}
                    onChange={(e) => setHeroElement(e.target.value)}>
                    <option >Я владею элементом...</option>
                    {renderFilters(filters, filtersLoadingStatus)}
                </select>
            </div>

            <button type="submit" className="btn btn-primary">Создать</button>
        </form>
    )
}

export default HeroesAddForm;