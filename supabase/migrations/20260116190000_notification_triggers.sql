-- Function to create notification when payment is received
CREATE OR REPLACE FUNCTION notify_payment_received()
RETURNS TRIGGER AS $$
DECLARE
  owner_user_id UUID;
  parcel_info TEXT;
BEGIN
  -- Get the user_id of the land owner from the payment
  SELECT lo.user_id, lp.parcel_id
  INTO owner_user_id, parcel_info
  FROM tax_assessments ta
  JOIN land_parcels lp ON ta.parcel_id = lp.id
  JOIN land_owners lo ON lp.owner_id = lo.id
  WHERE ta.id = NEW.tax_assessment_id;

  -- Create notification if user_id exists
  IF owner_user_id IS NOT NULL THEN
    INSERT INTO notifications (user_id, title, message, type, link)
    VALUES (
      owner_user_id,
      'Payment Received',
      'Your payment of ETB ' || NEW.amount || ' for parcel ' || parcel_info || ' has been successfully processed.',
      'payment',
      '/my-payments'
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to create notification when dispute is updated
CREATE OR REPLACE FUNCTION notify_dispute_updated()
RETURNS TRIGGER AS $$
DECLARE
  complainant_user_id UUID;
  respondent_user_id UUID;
BEGIN
  -- Get user IDs for both parties
  SELECT lo1.user_id, lo2.user_id
  INTO complainant_user_id, respondent_user_id
  FROM land_owners lo1
  LEFT JOIN land_owners lo2 ON lo2.id = NEW.respondent_id
  WHERE lo1.id = NEW.complainant_id;

  -- Notify complainant if status changed
  IF OLD.status IS DISTINCT FROM NEW.status AND complainant_user_id IS NOT NULL THEN
    INSERT INTO notifications (user_id, title, message, type, link)
    VALUES (
      complainant_user_id,
      'Dispute Status Updated',
      'Your dispute case ' || NEW.dispute_id || ' status has been updated to: ' || NEW.status,
      'dispute',
      '/my-disputes'
    );
  END IF;

  -- Notify respondent if they exist and status changed
  IF OLD.status IS DISTINCT FROM NEW.status AND respondent_user_id IS NOT NULL THEN
    INSERT INTO notifications (user_id, title, message, type, link)
    VALUES (
      respondent_user_id,
      'Dispute Status Updated',
      'Dispute case ' || NEW.dispute_id || ' involving your property has been updated to: ' || NEW.status,
      'dispute',
      '/my-disputes'
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to notify user when inquiry receives a response
CREATE OR REPLACE FUNCTION notify_inquiry_responded()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create notification if response was just added
  IF OLD.response IS NULL AND NEW.response IS NOT NULL AND NEW.user_id IS NOT NULL THEN
    INSERT INTO notifications (user_id, title, message, type, link)
    VALUES (
      NEW.user_id,
      'Inquiry Response Received',
      'Your inquiry "' || NEW.subject || '" has received a response from our staff.',
      'inquiry',
      '/citizen-portal'
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS payment_received_notification ON payments;
CREATE TRIGGER payment_received_notification
  AFTER INSERT ON payments
  FOR EACH ROW
  EXECUTE FUNCTION notify_payment_received();

DROP TRIGGER IF EXISTS dispute_updated_notification ON disputes;
CREATE TRIGGER dispute_updated_notification
  AFTER UPDATE ON disputes
  FOR EACH ROW
  EXECUTE FUNCTION notify_dispute_updated();

DROP TRIGGER IF EXISTS inquiry_responded_notification ON inquiries;
CREATE TRIGGER inquiry_responded_notification
  AFTER UPDATE ON inquiries
  FOR EACH ROW
  EXECUTE FUNCTION notify_inquiry_responded();
