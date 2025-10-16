import React from 'react';
import qs from 'qs';
import { useNavigate } from 'react-router-dom';

import Categories from '../components/Categories';
import Sort from '../components/Sort';
import PizzaBlock from '../components/PizzaBlock/PizzaBlock';
import { Skeleton } from '../components/PizzaBlock/Skeleton';
import Pagination from '../components/Pagination';
import { SearchContext } from '../App';
import { list } from '../components/Sort';

import { useSelector, useDispatch } from 'react-redux';
import { setCategoryId, setCurrentPage, setFilters } from '../redux/slices/filterSlice';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();
  const { categoryId, sort, currentPage } = useSelector((state) => state.filter);
  const dispatch = useDispatch();
  const isSearch = React.useRef(false);
  const isMounted = React.useRef(false);

  const { searchValue } = React.useContext(SearchContext);

  const [pizzas, setPizzas] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const [error, setError] = React.useState('');

  const fetchPizzas = async () => {
    try {
      setIsLoading(true);
      setError('');

      const order = sort.sortProperty.startsWith('-') ? 'desc' : 'asc';
      const sortBy = sort.sortProperty.replace('-', '');
      const search = searchValue ? `&title=${searchValue}` : '';
      const { data } = await axios.get(
        `https://68e3d7618e14f4523daed919.mockapi.io/items?page=${currentPage}&limit=4&category=${categoryId}${search}&sortBy=${sortBy}&order=${order}`,
      );

      if (data.length === 0) {
        setError('Ничего не найдено 😕');
      }
      setPizzas(data);
    } catch (err) {
      console.error(err);
      setError('Ошибка при получении данных 😔');
    } finally {
      setIsLoading(false);
    }
  };

  const onChangePage = (number) => {
    dispatch(setCurrentPage(number));
  };

  React.useEffect(() => {
    if (isMounted.current) {
      const queryString = qs.stringify({
        categoryId,
        sortProperty: sort.sortProperty,
        currentPage,
      });
      navigate(`?${queryString}`);
    }
    isMounted.current = true;
  }, [categoryId, sort.sortProperty, searchValue, currentPage, navigate]);

  React.useEffect(() => {
    if (window.location.search) {
      const params = qs.parse(window.location.search.substring(1));
      const sort = list.find((obj) => obj.sortProperty === params.sortProperty);

      dispatch(
        setFilters({
          ...params,
          sort,
        }),
      );
      isSearch.current = true;
    }
  }, [dispatch]);

  React.useEffect(() => {
    window.scrollTo(0, 0);

    if (!isSearch.current) {
      fetchPizzas();
    } else {
      isSearch.current = false;
    }
  }, [categoryId, sort.sortProperty, searchValue, currentPage]);

  const skeletons = [...new Array(6)].map((_, index) => <Skeleton key={index} />);
  const items = pizzas.map((obj) => <PizzaBlock key={obj.id} {...obj} />);

  return (
    <div className="container">
      <div className="content__top">
        <Categories value={categoryId} onChangeCategory={(i) => dispatch(setCategoryId(i))} />
        <Sort />
      </div>
      <h2 className="content__title">Все пиццы</h2>
      <div className="content__items">{isLoading ? skeletons : items}</div>
      <Pagination value={currentPage} onChangePage={onChangePage} />
    </div>
  );
};

export default Home;
