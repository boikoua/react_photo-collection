import { useEffect, useState } from 'react';
import { categories } from './api/categories';
import './App.scss';
import Collection from './components/Collection';
import { CollectionType } from './types/CollectionType';

function App() {
  const [collection, setCollection] = useState<CollectionType[]>([]);
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    fetch('https://66d5ae8af5859a7042670fd2.mockapi.io/gallery/collection')
      .then((response) => response.json())
      .then((collectionFromServer) => setCollection(collectionFromServer))
      .catch(() => console.log('Не удалось загрузить данные =('));
  }, []);

  return (
    <div className="app">
      <h1>Моя коллекция фотографий</h1>
      <div className="top">
        <ul className="tags">
          {categories.map((category) => (
            <li key={category.name}>{category.name}</li>
          ))}
        </ul>
        <input
          className="search-input"
          placeholder="Поиск по названию"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>
      <div className="content">
        {collection.map((item, index) => (
          <Collection key={index} name={item.name} images={item.photos} />
        ))}
      </div>
      <ul className="pagination">
        <li>1</li>
        <li className="active">2</li>
        <li>3</li>
      </ul>
    </div>
  );
}

export default App;
