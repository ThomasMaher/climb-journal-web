import { useState } from 'react';
import NewBoulderForm from './newBoulderForm';
import BoulderSearchForm from './boulderSearchForm';
import type { Boulder, BoulderSearchType, SessionClimbBoulder, SessionClimbFormData } from '../../../models/climbing_models';
import type { ApiFormErrors } from '../../../api/utils';

const CREATE = 'create';
const SEARCH = 'search';

type BoulderFormProps = {
  sessionId: string | undefined;
  userId: string | undefined;
  errors?: ApiFormErrors;
  handleBoulderCreated: (newBoulder: SessionClimbBoulder) => void;
};

function SearchAndCreateBoulder(props: BoulderFormProps) {
    const [content, setContent] = useState<'create' | 'search'>(CREATE);
    const [boulders, setBoulders] = useState<Boulder[]>([]);
    const [searchFormData, setSearchFormData] = useState<BoulderSearchType>({
        nickname: '',
        vgrade_range_min: 1,
        vgrade_range_max: 1,
        boulder_type: 'Indoor',
    });
    const [newBoulderFormData, setNewBoulderFormData] = useState<SessionClimbFormData>({
        nickname: '',
        vgrade_range_min: 1,
        vgrade_range_max: 1,
        self_grade: undefined,
        notes: '',
        incline: 0,
        boulder_type: 'Indoor',
        attempts: 0,
        percent_finished: 0,
        warmup: false,
    });

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
                    formData={newBoulderFormData}
                    setFormData={setNewBoulderFormData}
                    sessionId={props.sessionId} 
                    userId={props.userId} 
                    handleBoulderCreated={props.handleBoulderCreated}/> :
                <BoulderSearchForm 
                    boulders={boulders}
                    setBoulders={setBoulders}
                    formData={searchFormData}
                    setFormData={setSearchFormData}
                    // sessionId={props.sessionId} 
                    // userId={props.userId} 
                     />
            }
        </section>
    )
}

export default SearchAndCreateBoulder;