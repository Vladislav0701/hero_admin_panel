import { useSelector, useDispatch } from "react-redux";

import { actionFilter } from "./filtersSlice";

const HeroesFilters = () => {
    const {activeFilter, filters, filtersLoadingStatus} = useSelector(state => state.filters);
    const dispatch = useDispatch();

    if (filtersLoadingStatus === "loading") {
        return <h5 className="text-center mt-5">Идет загрузка</h5>
    } else if (filtersLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const renderFilters = (filters) => {

        if (filters && filters.length > 0) {
            return filters.map(({element, label, className}) => {
                const active = activeFilter === element ? " active" : ''
                return <button 
                            key={element} 
                            className={`btn ${className}${active}`}
                            onClick={() => dispatch(actionFilter(element))}
                        >{label}</button>
            })
        }
    }

    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Отфильтруйте героев по элементам</p>
                <div className="btn-group">
                    {renderFilters(filters, filtersLoadingStatus)}
                </div>
            </div>
        </div>
    )
}

export default HeroesFilters;