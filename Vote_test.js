const { BN, expectEvent, expectRevert } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");
const Voting = artifacts.require("Voting");

contract("Voting", function (accounts) {

  const admin = accounts[0];
  const Voteur1 = accounts[1];
  const Voteur2 = accounts[2];
  const NonVoteur = accounts[3];

  const Description_porpo_voteur1 = "proposition voteur 1";

  let Instance_contrat_vote;

  beforeEach(async function () {
    Instance_contrat_vote = await Voting.new({ from: admin }); // avant chaque test on vient initier un nouveau 
  });


////:::::::::::::::::::::::::::::::::::::::: les 11 testmandements :::::::::::::::::::::::::://


  //::::::::::::::::::::::::Test 1 : Ajouter un voteur par l'aministrateur ::::::::::::::::::// 

  it("Ajout d'un voteur par l'administrateuur", async function () {
    const Verif1 = await Instance_contrat_vote.addVoter(Voteur1, { from: admin }); //L'admin ajout le voteur1
    voter = await Instance_contrat_vote.getVoter(Voteur1, { from: Voteur1 }); //on recupere voteur1
    
    expect(voter.isRegistered).to.equal(true); // test que la fonction addvoter a bien rajouter le voteur1

    expectEvent(Verif1, "VoterRegistered", { voterAddress: Voteur1 }); 

  });



  //::::::::::::::::::::::: Test2 :  Que l'administrateur qui peut rajouter des voteur ::::::::::://
  it("Que l'admin que peut rajouter des voteur", async function () {  // on verifie que l'ajout declenche un revert si ce n'est pas l'admin
    await expectRevert( Instance_contrat_vote.addVoter(Voteur2, { from: Voteur1 }), "Ownable: caller is not the owner" ); 
  });


  //:::::::::::::::::::::: Test3 Enregistrement unique du voteur ::::::::::::::::// 
  it("Enregistrement unique du voteur", async function () {
    await Instance_contrat_vote.addVoter(Voteur1, { from: admin });
    await expectRevert(Instance_contrat_vote.addVoter(Voteur1, { from: admin }),  "Already registered"
    );
  });


  //:::::::::::::::::::: Test4 : Ouverture des enregistrement des voteurs, etat Restringvoter  ::::::::::::::::://
  it("On est à la bonne etape pour enregistrer les voteurs ===> RegisteringVoters ", async function () {
    Instance_contrat_vote.startProposalsRegistering({ from: admin });
    await expectRevert( Instance_contrat_vote.addVoter(Voteur1, { from: admin }),"Voters registration is not open yet"  );
  });



  // ::::::::::::::::::: Test5 : Enregistrement d'une proposition par un voteur ::::::::::::::::::::::::::::::::://
  it("Verification de l'ajout d'une proposition par le Voteur1", async function () {
    await Instance_contrat_vote.addVoter(Voteur1, { from: admin });  //etape 1 préalable
    await Instance_contrat_vote.startProposalsRegistering({ from: admin }); //etape 2 préalable 

    const propositionVoteur1 = await Instance_contrat_vote.addProposal(Description_porpo_voteur1, { from: Voteur1 }); // ajout de la proposition  par voteur1

    const recuperer_propo_voteur1 = await Instance_contrat_vote.getOneProposal(0, {from: Voteur1,}); // Recuperation de la proposition


    expect(recuperer_propo_voteur1.description).to.equal(Description_porpo_voteur1); // verification que c'est bien la desciption proposition voteur 1

    expectEvent(propositionVoteur1, "ProposalRegistered", {proposalId:  new BN(0),}); // verif evenemnt de cyril dans addproposal 
  });



  // :::::::::::::::: Test 6 : seul voteur peut soumettre une proposition ::::::::::::::::::::::::::::://
  it("seul voteur peut soumettre une proposition", async function () {
    await Instance_contrat_vote.addVoter(Voteur1, { from: admin });  //etape 1 préalable
    await Instance_contrat_vote.startProposalsRegistering({ from: admin }); //etape 2 préalable 
    await expectRevert(Instance_contrat_vote.addProposal(Description_porpo_voteur1, { from: NonVoteur }),  "You're not a voter" );
});



  //::::::::: Test7: On est bien à la bonne etape pour enregistrement de propostion  ::::::::::::::::::://
  it("L'enregistrement de la proposition est fait a la bonne etape du workflow", async function () {
    await Instance_contrat_vote.addVoter(Voteur1, { from: admin });
    await Instance_contrat_vote.startProposalsRegistering({ from: admin });
    await Instance_contrat_vote.endProposalsRegistering({ from: admin });
    await expectRevert(Instance_contrat_vote.addProposal(Description_porpo_voteur1, { from: Voteur1 }), "Proposals are not allowed yet"
    );
  });



  //:::::::::::::::::::::: Test8 : Lancment de la session de vote par l'administrateur :::::::::::::::::://
  it("Lancment de la session de vote par l'administrateur", async function () {
    await Instance_contrat_vote.addVoter(Voteur1, { from: admin });
    await Instance_contrat_vote.startProposalsRegistering({ from: admin });
    await Instance_contrat_vote.endProposalsRegistering({ from: admin });
    await expectRevert( Instance_contrat_vote.startVotingSession({ from: Voteur1 }), "Ownable: caller is not the owner" );
  });


  //:::::::::::::::::::::: Test9: démarrage du vote ::::::::::::::::::::::::::://
  it("Session de vote ouverte", async function () {
   // Etapes préalables
    await Instance_contrat_vote.addVoter(Voteur1, { from: admin });
    await Instance_contrat_vote.startProposalsRegistering({ from: admin });
    await Instance_contrat_vote.addProposal(Description_porpo_voteur1, { from: Voteur1 });
    await Instance_contrat_vote.endProposalsRegistering({ from: admin });
    await Instance_contrat_vote.startVotingSession({ from: admin });
   
   // on recuere les varialbles a tester
    const Il_vote = await Instance_contrat_vote.setVote(0, { from: Voteur1 }); // on attend l'evenement Voted comme decrit dans voting.sol
    const voter = await Instance_contrat_vote.getVoter(Voteur1, { from: Voteur1 }); 
    const propositionVoteur1 = await Instance_contrat_vote.getOneProposal(0, { from: Voteur1, });


    expect(voter.votedProposalId).to.be.equal("0");
    expect(voter.hasVoted).to.be.equal(true);
    expect(propositionVoteur1.description).to.be.equal(Description_porpo_voteur1);
    expect(propositionVoteur1.voteCount).to.be.equal("1");
    expectEvent(Il_vote, "Voted", { voter: Voteur1, proposalId: new BN(0) });});




  //:::::::::::::::: Test 10: Une personne non enregistre ne peut pas voter :::::::::::::::::::::////
  it("Un NonVoteur ne peut point voter", async function () {
    await Instance_contrat_vote.addVoter(Voteur1, { from: admin });
    await Instance_contrat_vote.startProposalsRegistering({ from: admin });
    await Instance_contrat_vote.addProposal(Description_porpo_voteur1, { from: Voteur1 });
    await Instance_contrat_vote.endProposalsRegistering({ from: admin });
    await Instance_contrat_vote.startVotingSession({ from: admin });

    await expectRevert( Instance_contrat_vote.setVote(0, { from: NonVoteur }), "You're not a voter" ); });



  //:::::::::::::::::::::: Test11 Un voteur vote une seule fois :::::::::::::::::::// 
  it("Un voteur vote une seule fois", async function () {
    await Instance_contrat_vote.addVoter(Voteur1, { from: admin });
    await Instance_contrat_vote.startProposalsRegistering({ from: admin });
    await Instance_contrat_vote.addProposal(Description_porpo_voteur1, { from: Voteur1 });
    await Instance_contrat_vote.endProposalsRegistering({ from: admin });
    await Instance_contrat_vote.startVotingSession({ from: admin });
    await Instance_contrat_vote.setVote(0, { from: Voteur1 }); // il vote
    await expectRevert( Instance_contrat_vote.setVote(0, { from: Voteur1 }), "You have already voted"); // revert si il veut revoter
  });
});


////////////////////// The End.

  

