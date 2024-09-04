import { useEffect, useState } from 'react';
import { categories } from './api/categories';
import './App.scss';
import Collection from './components/Collection';
import { CollectionType } from './types/CollectionType';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [collection, setCollection] = useState<CollectionType[]>([]);
  const [search, setSearch] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<number>(0);
  const [selectPage, setSelectPage] = useState<number>(1);

  const itemsPerPage = 3;

  useEffect(() => {
    setLoading(true);
    fetch('https://66d5ae8af5859a7042670fd2.mockapi.io/gallery/collection')
      .then((response) => response.json())
      .then((collectionFromServer) => setCollection(collectionFromServer))
      .catch(() => console.log('Не удалось загрузить данные =('))
      .finally(() => setLoading(false));
  }, []);

  const filteredCollectionByCategory = collection.filter((item) => {
    if (activeCategory > 0) {
      return item.category === activeCategory;
    }
    return true;
  });

  const filteredAndPaginatedCollection = filteredCollectionByCategory
    .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
    .slice((selectPage - 1) * itemsPerPage, selectPage * itemsPerPage);

  const showPages = (
    allElements: number,
    allElementsOnOnePage: number
  ): number[] => {
    const pageCount = Math.ceil(allElements / allElementsOnOnePage);

    const res = [];

    for (let i = 1; i <= pageCount; i++) {
      res.push(i);
    }

    return res;
  };

  return (
    <div className="app">
      <h1>Моя коллекция фотографий</h1>
      <div className="top">
        <ul className="tags">
          {categories.map((category) => (
            <li
              className={category.id === activeCategory ? 'active' : ''}
              key={category.name}
              onClick={() => {
                setActiveCategory(category.id);
                setSelectPage(1);
              }}
            >
              {category.name}
            </li>
          ))}
        </ul>
        <input
          className="search-input"
          placeholder="Поиск по названию"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setSelectPage(1);
          }}
        />
      </div>

      {loading ? (
        <h2>Загрузка коллекции...</h2>
      ) : (
        <div className="content">
          {filteredAndPaginatedCollection
            .filter((item) =>
              item.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((item, index) => (
              <Collection key={index} name={item.name} images={item.photos} />
            ))}
        </div>
      )}

      <ul className="pagination">
        {showPages(filteredCollectionByCategory.length, itemsPerPage).map(
          (page) => (
            <li
              className={page === selectPage ? 'active' : ''}
              key={page}
              onClick={() => setSelectPage(page)}
            >
              {page}
            </li>
          )
        )}
      </ul>
    </div>
  );
}

export default App;
