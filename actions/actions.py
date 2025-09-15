# backend/actions/actions.py


from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet




def _friendly_join(items: List[Text]) -> Text:
   """Helper to join strings with commas, ignoring blank ones."""
   return ", ".join([i for i in items if i])




class ActionSetConditionFlags(Action):
   def name(self) -> Text:
       return "action_set_condition_flags"


   def run(self,
           dispatcher: CollectingDispatcher,
           tracker: Tracker,
           domain: Dict[Text, Any]) -> List[SlotSet]:


       privacy_cue = tracker.get_slot("privacy_cue") or "on"
       ai_lit = tracker.get_slot("ai_literacy") or "unknown"


       # Store normalized flags for later use
       return [SlotSet("privacy_cue", privacy_cue), SlotSet("ai_literacy", ai_lit)]




class ActionRecommendPlans(Action):
   def name(self) -> Text:
       return "action_recommend_plans"


   def run(self,
           dispatcher: CollectingDispatcher,
           tracker: Tracker,
           domain: Dict[Text, Any]) -> List[SlotSet]:


       state = tracker.get_slot("state")
       budget = tracker.get_slot("budget")
       household = tracker.get_slot("household_size")
       provider = tracker.get_slot("preferred_provider")


       recs = []


       if budget and str(budget).lower() in {"low", "$200", "$250", "$300"}:
           recs.append("Plan A: lower premium, higher deductible")
       else:
           recs.append("Plan B: balanced premium/deductible")


       if provider:
           recs.append(f"Network match likely compatible with {provider} (verify in plan docs).")


       persona_bits = _friendly_join([state, f"HH={household}" if household else None, f"budget={budget}" if budget else None])
       msg_prefix = f"Based on what I know ({persona_bits}) " if persona_bits else "Based on what you shared "


       dispatcher.utter_message(text=f"{msg_prefix}here are some directions:\n• " + "\n• ".join(recs))
       dispatcher.utter_message(text="If you want, give me your state, budget, household size, and preferred provider to refine further.")


       return []




class ActionStartBankAccount(Action):
   def name(self) -> Text:
       return "action_start_bank_account"


   def run(self,
           dispatcher: CollectingDispatcher,
           tracker: Tracker,
           domain: Dict[Text, Any]) -> List[SlotSet]:


       dispatcher.utter_message(text="To start, I’ll outline typical steps (no personal data stored beyond this chat):")
       dispatcher.utter_message(text="1) Pick account type • 2) Provide basic identity info • 3) Initial funding • 4) Card delivery.")
       return []
