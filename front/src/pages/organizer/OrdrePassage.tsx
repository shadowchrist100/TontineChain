import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTontine } from '../../hooks/useTontines';
import { Spinner } from '../../components/ui/Spinner';
import { MemberAvatar } from '../../components/tontine/MemberAvatar';
import { MOCK_USERS } from '../../mocks/users.mock';
import { ArrowLeft, GripVertical, Lock, Save } from 'lucide-react';
import { toast } from 'sonner';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableMemberProps {
  id: string;
  position: number;
  prenom: string;
  nom: string;
  telephone: string;
  locked: boolean;
}

function SortableMember({ id, position, prenom, nom, telephone, locked }: SortableMemberProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id, disabled: locked });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`sortable-member-row ${isDragging ? 'dragging' : ''} ${locked ? 'locked' : ''}`}
    >
      <div className="drag-handle" {...(locked ? {} : { ...attributes, ...listeners })}>
        {locked ? <Lock size={16} className="lock-icon" /> : <GripVertical size={16} />}
      </div>
      <div className="member-position">#{position}</div>
      <MemberAvatar nom={nom} prenom={prenom} size="sm" />
      <div className="member-info">
        <span className="member-name">{prenom} {nom}</span>
        <span className="member-phone">{telephone}</span>
      </div>
    </div>
  );
}

export function OrdrePassage() {
  const { id } = useParams<{ id: string }>();
  const { data: tontine, isLoading } = useTontine(id!);
  const navigate = useNavigate();

  const members = MOCK_USERS.filter(u => tontine?.membresIds.includes(u.id) ?? false);
  const [order, setOrder] = useState<string[]>(() => members.map(m => m.id));
  const [saved, setSaved] = useState(false);
  const locked = (tontine?.cycleActuel ?? 0) > 0;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setOrder(items => {
        const from = items.indexOf(active.id as string);
        const to = items.indexOf(over.id as string);
        return arrayMove(items, from, to);
      });
    }
  };

  const handleSave = () => {
    setSaved(true);
    toast.success('Ordre de passage enregistré sur la blockchain !');
    setTimeout(() => navigate(-1), 1500);
  };

  if (isLoading) return <div className="loading-center"><Spinner size="lg" /></div>;

  return (
    <div className="page page-narrow">
      <div className="page-header">
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Retour
        </button>
        <h1 className="page-title">Ordre de Passage</h1>
      </div>

      {locked && (
        <div className="alert alert-warning">
          <Lock size={18} />
          <p>Le cycle a déjà démarré. L'ordre de passage est verrouillé et ne peut plus être modifié.</p>
        </div>
      )}

      <div className="card">
        <p className="card-desc">
          {locked
            ? 'Voici l\'ordre de passage des bénéficiaires.'
            : 'Glissez-déposez les membres pour définir l\'ordre de passage des distributions.'}
        </p>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={order} strategy={verticalListSortingStrategy}>
            <div className="sortable-list">
              {order.map((uid, i) => {
                const m = MOCK_USERS.find(u => u.id === uid);
                if (!m) return null;
                return (
                  <SortableMember
                    key={uid}
                    id={uid}
                    position={i + 1}
                    prenom={m.prenom}
                    nom={m.nom}
                    telephone={m.telephone}
                    locked={locked}
                  />
                );
              })}
            </div>
          </SortableContext>
        </DndContext>

        {!locked && (
          <div className="form-actions">
            <button className="btn btn-ghost" onClick={() => navigate(-1)}>Annuler</button>
            <button
              className="btn btn-primary"
              id="btn-save-ordre"
              onClick={handleSave}
              disabled={saved}
            >
              <Save size={18} /> Enregistrer l'ordre
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
