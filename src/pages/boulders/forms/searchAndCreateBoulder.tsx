import { useState } from 'react';
import NewBoulderForm from './newBoulderForm';
import BoulderSearchForm from './boulderSearchForm';
import type { BoulderFormProps } from '../../../models/climbing_models';

const CREATE = 'create';
const SEARCH = 'search';

function SearchAndCreateBoulder(props: BoulderFormProps) {
    const [content, setContent] = useState<'create' | 'search'>(CREATE);

    const toggleContent = (newState: 'create' | 'search') => {
        setContent(newState)
    }

    return (
        <section className="form-panel">
            <div className="page-header__toggler">
                <div onClick={() => toggleContent(CREATE)}>
                    <h2 className={content !== CREATE ? 'inactive form-panel__title' : 'form-panel__title'}>Add a Boulder</h2>
                    {content === CREATE && <hr />}
                </div>
                <div onClick={() => toggleContent(SEARCH)}>
                    <h2 className={content !== SEARCH ? 'inactive form-panel__title' : 'form-panel__title'}>Search Existing Boulders</h2>
                    {content === SEARCH && <hr />}
                </div>
            </div>

            {content === CREATE ?
                <NewBoulderForm 
                    sessionId={props.sessionId} 
                    userId={props.userId} 
                    handleBoulderCreated={props.handleBoulderCreated}/> :
                <BoulderSearchForm 
                    // sessionId={props.sessionId} 
                    // userId={props.userId} 
                     />
            }
        </section>
    )
}

export default SearchAndCreateBoulder;