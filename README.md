
                              # les 11 testmandements

### Test 1 : Fonction AddVoter => Tester que l'administrateur peut bien rajouter un voteur#
### Test 2 : Fonction AddVoter => Tester que seul l'administrateur peut rajouter un voteur
### Test 3 : Fonction AddVoter => Tester qu'un voteur ne peut pas etre enregistré plus qu'une fois
### Test 4 : Fonction AddVoter => Tester qu'on bien dans la bonne étape via la variable d'etat

##

### Test 5 : Fonction AddProposal => Tester le bon ajout de la proposition du voteur
### Test 6 : Fonction AddProposal => Tester qu'ne proposition ne peut etre soumise que par un voteur enregistré 
### Test 7 : Fonction AddProposal => Tester qu'on est bien à la bonne etape d'ajout de proposition

### Test 8 : Fonction StartVotingSession => Tester que ce n'est que l'administrateur qui peut lancer les votes
### Test 9 : Fonction Set & Get Voter => Tester le bon deroulement de l'enregistrement du vote 
### Test 10 : Fonction SetVoter => Une personne non enregistre ne peut pas voter
### Test 11 : Fonction SetVoter => Un voteur ne peut voter qu'une et une seule fois


--------------------------------------------------------

## Eth gas reporter 

 ✓ Ajout d'un voteur par l'administrateuur (91ms, 50196 gas)
    ✓ Que l'admin que peut rajouter des voteur (544ms)
    ✓ Enregistrement unique du voteur (70ms, 50196 gas)
    ✓ On est à la bonne etape pour enregistrer les voteurs ===> RegisteringVoters  (130ms, 74384 gas)
    ✓ Verification de l'ajout d'une proposition par le Voteur1 (183ms, 174601 gas)
    ✓ seul voteur peut soumettre une proposition (116ms, 97849 gas)
    ✓ L'enregistrement de la proposition est fait a la bonne etape du workflow (157ms, 128424 gas)
    ✓ Lancment de la session de vote par l'administrateur (172ms, 128424 gas)
    ✓ Session de vote ouverte (387ms, 293807 gas)
    ✓ Un NonVoteur ne peut point voter (258ms, 235706 gas)
    ✓ Un voteur vote une seule fois (332ms, 293807 gas)

  11 passing (13s)

  ## Merci de trouver le tableau des resultat en capture d'ecran