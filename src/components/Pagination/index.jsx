import React from 'react';
import ReactPaginate from 'react-paginate';
import s from './Pagination.module.scss';

const Pagination = ({ value, onChangePage }) => {
  return (
    <ReactPaginate
      className={s.root}
      breakLabel="..."
      nextLabel=">"
      onPageChange={(e) => onChangePage(e.selected + 1)}
      pageRangeDisplayed={4}
      pageCount={3}
      forcePage={value - 1}
      previousLabel="<"
      renderOnZeroPageCount={null}
    />
  );
};

export default Pagination;
