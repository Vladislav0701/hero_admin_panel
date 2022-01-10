import { useSelector, useDispatch } from "react-redux";

import { actionFilter } from "../../actions";

const HeroesFilters = () => {
    const {activeFilter, filters, filtersLoadingStatus} = useSelector(state => state);
    const dispatch = useDispatch();

    const renderFilters = (filters, status) => {
        if (status === "loading") {
            return <h5>Идет загрузка</h5>
        } else if (status === "error") {
            return <h5>Ошибка загрузки</h5>
        }

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