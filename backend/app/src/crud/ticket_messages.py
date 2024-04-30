from sqlalchemy.orm import Session


from ..ormodels import TicketMessage
from ..schemas.ticket_message import TicketMessageBase, TicketMessageCreate
from ..utils import unfoundable


@unfoundable("ticket")
def read_many(db: Session, *, ticket_id: int) -> list[TicketMessageBase]:
    results_orm = db.query(TicketMessage).where(TicketMessage.ticket_id == ticket_id)
    results = [
        TicketMessageBase.model_validate(result_orm) for result_orm in results_orm
    ]
    return results


def create(
    db: Session, *, ticket_id: int, message: TicketMessageCreate
) -> TicketMessageBase:
    result_orm = TicketMessage(
        sender=message.sender if message.sender else "<senza-firma>",
        body=message.body,
        ticket_id=ticket_id,
    )

    db.add(result_orm)
    db.commit()
    db.refresh(result_orm)

    result = TicketMessageBase.model_validate(result_orm)
    return result
