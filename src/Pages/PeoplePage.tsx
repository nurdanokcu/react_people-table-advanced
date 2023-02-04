import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PeopleFilters } from '../components/PeopleFilters';
import { Loader } from '../components/Loader';
import { PeopleTable } from '../components/PeopleTable';
import { getPeople } from '../api';
import { Person } from '../types/Person';

export const PeoplePage:React.FC = () => {
  const [isLoading, setLoading] = useState(false);
  const [didload, setLoaded] = useState(false);
  const [people, setPeople] = useState<Person[]>([]);
  const [hasError, setError] = useState(false);
  const { personSlug } = useParams();

  useEffect(() => {
    const loadPeople = async () => {
      setLoading(true);
      try {
        const peopleFromServer = await getPeople();

        setPeople(peopleFromServer);
        setLoaded(true);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadPeople();
  }, [getPeople]);

  const showTable = !isLoading
    && didload
    && !hasError
    && people.length > 0;

  return (
    <>
      <h1 className="title">People Page</h1>

      <div className="block">
        <div className="columns is-desktop is-flex-direction-row-reverse">
          {showTable && (
            <div className="column is-7-tablet is-narrow-desktop">
              <PeopleFilters />
            </div>
          )}

          <div className="column">
            <div className="box table-container">
              {isLoading && <Loader />}

              {hasError && (
                <p data-cy="peopleLoadingError" className="has-text-danger">
                  Something went wrong
                </p>
              )}

              {didload && !people.length && (
                <p data-cy="noPeopleMessage">
                  There are no people on the server
                </p>
              )}

              <p>There are no people matching the current search criteria</p>

              {showTable && (
                <PeopleTable
                  people={people}
                  personSlug={personSlug}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
