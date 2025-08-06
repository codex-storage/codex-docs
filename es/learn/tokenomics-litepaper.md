---
outline: [1, 3]
---
# Codex Tokenomics Litepaper - Testnet Version

**Codex: A Decentralized Storage Protocol for Durable Information**

# Legal Notices

*The information contained in this document is intended to be made available for informational purposes only and does not constitute a prospectus, nor an offer to buy, a solicitation or an invitation to buy, or a recommendation for any token or any security. Neither this document nor any of its content should be considered as creating any expectations or forming the basis of any contract, commitment or binding obligation. No information herein should be considered to contain or be relied upon as a promise, representation, warranty or guarantee, whether express or implied and whether as to the past, present or the future in relation to the projects and matters described herein. The information presented is a summary and does not purport to be accurate, reliable or complete. This document is under continuous legal review and may be amended or supplemented at any time without prior notice.  No responsibility will be borne for the accuracy, reliability or completeness of information contained herein. Because of the high degree of risk and uncertainty described above, undue reliance should not be placed by anyone on any matters described in this document. Any tokens referenced in this document have not been registered under any securities laws and may not be offered or sold in any jurisdiction where such offer or sale would be prohibited.*

*This document may contain forward-looking statements that are based only on current expectations, estimates, forecasts, assumptions and projections about the technology, industry and markets in general. The forward looking statements, projects, content and any other matters described in this document are subject to a high degree of risk and uncertainty. The roadmap, results, project descriptions, technical details, functionalities, and other features are subject to change based on, among other things, market conditions, technical developments, and regulatory environment. The actual development and results, including the order and the timeline, might differ materially from those anticipated in these forward-looking statements.*

*The information contained in this document does not constitute financial, legal, tax, investment, professional or other advice and should not be treated as such.*

# Overview

## Scope

This document describes the Codex Tokenomics with elements that reflect the Testnet deployment of the Codex Protocol.

## What Codex Does

Codex is a state-of-the-art decentralized storage platform that offers a novel solution that enhances data durability guarantees for storing vast amounts of data while eliminating any reliance on centralized institutions that could lead to a single point of failure.

While centralized storage systems such as Google Cloud tout eleven nines of durability, durable file storage in distributed systems that provide censorship resistance and privacy are a vital prerequisite to use cases such as preserving factual records of history in network states.

While no system can guarantee absolute protection against data loss, through its technical architecture, economic incentives, and algorithmic encoding, Codex is designed to provide highly decentralized data storage with high durability, resiliency to cloud failures, and resistance to censorship.

## How Codex Works

Codex operates as a network of storage nodes, referred to herein as **Storage Providers** (SP), that store user data for the duration of a contract entered into by SPs and storage users, referred to herein simply as **Clients**.

Storage contracts are initiated by a **Client** requesting to store a specified amount of data, for a specified amount of time, and at a specific price per the full contract. **Storage Providers** commit to slots to store redundant fragments of this data.

The fact that **SPs** must post collateral (stake) in order to fill a slot helps protect against Sybil attacks, promoting diversity in storage nodes fulfilling each contract. Additionally, this collateral acts as an economic incentive to ensure that **SPs** fulfill their obligations to periodically prove that they are still in possession of the data in question.

This is achieved by periodic challenges to **SPs** to provide cryptographic proofs that demonstrate the data they have contracted to store can be retrieved. Codex incorporates Zero Knowledge (ZK) and Data Availability Sampling (DAS) to achieve low-cost, highly efficient, and reliable data loss detection.

**SPs** are required to respond to these challenges, sending their proofs to **Validators,** who verify the validity of the proofs and posts to the blockchain only the absence of a proof. This reduces costs of validating proofs, while not affecting the **Protocol**’s security.

Should SPs fail to prove a fixed number of times they still have the data in question, or send an invalid proof, their collateral is partially slashed. The slash penalty is a fixed percentage of the total collateral. This slashing continues until a certain number of slashings is reached, at which point the entire collateral is slashed. At this moment, the SP slot is considered “abandoned”. The slashed collateral is used as an incentive for a new **SP** to take over the failed slot through the “slot recovery mechanism” (discussed further later). This ensures the collateral provides an economic incentive to ensure the durability of the data.

Codex is thus designed such that rational behavior for **SPs** consists of storing the data in the most space-efficient manner to minimize excess storage costs, while balancing the need for enough redundancy to recover from the possibility of data loss/corruption by the penalty of forfeiture of their collateral (slashing).

While Codex’s tech maximizes recoverability and durability in the event of partial data loss, Codex’s economic incentives coordinate rational actors to provide a stable and predictable environment for data storage users. At the heart of these economic incentives is the Codex utility token (CDX), which serves as the collateral to protect file durability and facilitate slot repair, and the means of payment to coordinate successful storage contracts.

# Contract Lifecycle

The marketplace coordinates matching **Clients** who want to pay for storing files with **Storage Providers** who are offering storage space and posting collateral in order to earn payments for the contract.

## Contract Request Initiation

As a design principle, **Clients** should post the deal terms they are looking for, and Storage Providers prioritize which deals meet their criteria and pose the best deals to take.

When the contract request is created, the **Client** deposits the full price of the length of the contract at that time. This deposit acts as a spam prevention mechanism and ensures that **SP** time and resources are not wasted filling slots for deals that a **Client** does not complete payment for.

## Storage Providers Fill Requests

Ahead of matching with storage contracts, **Storage Providers** specify their aggregate availabilities for new contracts.

Based on each **SPs’** availabilities, a queue is created for each **SP**, ranking the open **Client** request for contract deals with the most favorable deals at the top. Over time, this queue resolves by pairing **SPs** with contracts that are compatible with their availabilities, starting with the highest ranked deals first.

At launch, **SPs** will not be able to customize the queue creation algorithm, which means **SPs** with the same availabilities will have identical queues (other than differences due to a randomness function that increases **SP** diversity per each contract). In the future, **SPs** are expected to be able to customize their queue ranking algorithm.

If a **SP** matches with a storage contract and they're eligible to reserve a slot in the contract, they reserve an open slot, download the slot data from the **Client** or existing **SPs** whose data can be used to reconstruct the slot’s contents, create an initial storage proof, and submit this proof, along with collateral, to the **Protocol**.

Note that a slot is not considered confirmed as filled until after an **SP** both posts associated collateral and produces a proof for the slot.

## Contract Expires Before Beginning

If there are still empty slots when the timeout/expiry for the contract request expires, the deal is terminated.

The **Storage Providers** who did fill slots, if any, are compensated for the amount of time which they did store the slot data, at the contract requests specified price per TB per Month. The remainder of the **Client**’s deposit is returned. 

As there is a high probability of having at least a few slots occupied, there should be no need for further penalties on the **Client** to prevent spam requests and incentivise **Clients** to submit attractive deals.

## Contract Begins

The contract begins if *all* slots are occupied, that is, **SPs** have downloaded the data, posted collateral, and posted proofs before the timeout/expiry for the contract request is reached.

At this moment, a *protocol fee* is applied on the user’s deposit. The proceedings are burned.

The remaining of the client’s deposit is held by the protocol and will be used to pay **SPs** at the end of the contract.

## Contract is Running

**Storage Providers** must submit proofs to **Validators** according to the storage request’s proof frequency, a parameter set by the Client in the request.

### Missing Proofs

If an **SP** fails to submit proofs within the rolling last periods, they are partially slashed. The penalty is a fixed percentage of the collateral. Upon provision of a proof after being partially slashed, the SP should top up the missing collateral.

Should the SP be slashed enough times, their entire collateral will be slashed and confiscated, and the SP is considered to have abandoned its slot. The provision of a correct proof at this moment will not revert the start of the slot recovery mechanism.

## A Slot in the Contract is Abandoned

When an **SP** fails to submit enough proofs such that they are slashed enough times, their slot is considered abandoned. In order to incentivize a new **SP** to come in and takeover the abandoned slot (slot recovery), 50% of the collateral confiscated from the **SP** which has abandoned the slot is used as an incentive to the new **SP**. The remaining confiscated collateral is burned.

This helps align the economic incentive for **SPs** to take over abandoned slots before filling new deals, since they can effectively earn forfeited collateral for taking over and fulfilling abandoned slots.

## Contract Defaults

If, at any time during the life of the storage contract, the number of slots currently in an abandoned state (not yet recovered), meets or exceeds the maximum number of storage slots that can be lost before the data is unrecoverable, then the entire storage deal is considered to be in a *failed* state.

Each **Storage Providers** posted collateral is burned. This incentivizes **SPs** not to let storage deals to be at risk of defaulting. **SPs** are incentivized to *proactively* avoid this by diversifying their infrastructure and the storage contracts they enter, and *reactively* by backing up their own slot data, or even backing up data from other slots so they can better assist slot recovery, as the deal approaches a failed state.

Clients also receive back any leftover from their original payment.

## Contract Ends Its Full Duration

When a started contract reaches its pre-specified duration without having previously defaulted, the contract completes.

All collateral is returned to **SPs t**hat currently fill the slots (note due to slot recovery these are not necessarily the same **SPs** that filled the slots at contract inception), and all remaining payment is returned to the client.

Deals can not be automatically rolled forward or extended. If a **Client** desires to continue a deal, they must create a new storage contract request. Otherwise, Clients can retrieve their data.

# CDX Testnet  Tokenomics

The CDX token does not exist in the Testnet Phase. The description below refers to the mechanics of a Testnet token and not CDX itself and will be referred to as *CDX (Testnet token)* for this purpose.

For the avoidance of doubt, the *CDX (Testnet token)* are virtual items with no value of any kind and they are not convertible to any other currency, token, or any other form of property. They are solely intended to be utilised for the purposes of enabling the tokenomics and facilitating the different roles in this Testnet Phase.

## Roles

The Codex protocol has two primary roles fulfilled by network participants.

- **Clients**: pay Storage Providers in *CDX (Testnet token)* to securely store their data on the Codex network for an agreed upon amount of time.
- **Storage Providers**: post *CDX (Testnet token)* collateral to enter into storage contracts with Clients in exchange for a *CDX (Testnet token)* denominated payment.
- **Validators**: post *CDX (Testnet token)* collateral to validate storage proofs in exchange for a *CDX (Testnet token)* denominated payment.

## Token Utility

The *CDX (Testnet token)* is used as both a form of posted collateral and a means of payment in order to secure the network and access its services.

Collateral is primarily used as a spam and sybil-attack prevention mechanism, liability insurance (e.g. compensating Clients in case of catastrophic loss of data), and to enforce rational behavior.

Payments are made by Clients to Providers for services rendered, such as for storing data for a certain amount of time or retrieving data. This is implemented through the Marketplace contract, which serves as an escrow. Data in a storage contract is distributed into slots where each is, ideally, hosted by a different Storage Provider.

### **For Clients**

- Pay storage costs and fees in *CDX (Testnet token)* for storing files.

### **For Storage Providers**

- Post collateral in *CDX (Testnet token)* when committing to new storage contracts. This collateral is slashed if they do not fulfill their agreed upon services.
- Earn *CDX (Testnet token)* from the collateral of slashed Storage Providers by participating in the slot recovery mechanism.
- Earn *CDX (Testnet token)* from Clients when successfully completing the storage service.

### For Validators

- Post collateral in *CDX (Testnet token)* to operate the validation service. This collateral is slashed if they do not mark a proof as missing within a predetermined period.
- Earn *CDX (Testnet token)* from the collateral of slashed Storage Providers by marking proofs as missed

Figure below depicts the flow of the *CDX (Testnet token)* token within the system.

![Flow of the *CDX token within the system](/learn/tokenomics-token-flow.png)

## Value Capture and Accrual Mechanisms

Codex creates *value* to participants:

- Clients can benefit from storing data with strong durability guarantees;
- Storage Providers can earn yield from their spare resources or capital by providing a service.
- Validators earn payouts for marking proofs as missing.

Clients need *CDX (Testnet token)* tokens to request storage deals. *CDX (Testnet token)* captures the value created to Clients by being a *Value Transfer Token* to them.

Storage Providers and Validators are rewarded in *CDX (Testnet token)* token and also need it as a proof of commitment to the Protocol. They risk being slashed in exchange for rewards. *CDX (Testnet token)* captures the value created to Providers by being a *Work Token* to them.

The following mechanisms describe how the value accrues to the *CDX (Testnet token)* token.

### Protocol Fee over Contracts

If the contract is canceled before it starts, Client's deposited amount is charged a small penalty and returned, aiding to prevent low quality spam deal requests.

If the contract successfully initiates, the protocol collects a fee for facilitating the transaction. The remaining amount is made available for payments to Storage Providers.

The collected fees are burned in both cases. This creates a small but constant deflationary force on the token supply, which is proportional to the product demand.

## Behavior & Motivations

### Clients

Clients have the following rational behavior:

- Requesting storage from the network with a fee at fair market rates
- Providing data to storage nodes that meet their criteria

They may also exhibit the following adversarial behavior, whether for profit driven, malicious, or censorship motivations:

- Requesting storage from the network but never making the data available for any or all slots
- Requesting storage from the network but not releasing the data within required time period to begin the contract successfully
- Requesting storage from the network but not releasing the data to specific Providers
- Attacking SPs that host their data to attempt to relieve their payment obligations at the end of the contract.

### **Storage Providers**

Storage Providers have the following rational behavior:

- Committing to slots of storage contracts to earn a fee.
- Providing proofs of storage for their committed slots to avoid collateral slashing penalties.
- Releasing the data to anyone who requests it.
- Committing to failed slots of storage contracts to maintain the integrity of the data

They may also exhibit the following adversarial behavior, whether for profit driven, malicious, or censorship motivations:

- Reserving a contract slot but never filling it (attempt to prevent contract from starting)
- Ceasing to provide proofs mid the lifespan of a contract
- Producing proofs, but not making data available for other nodes to retrieve

### Validators

Validators have the following rational behavior:

- Marking a proof as missing to earn a fee
- Tracking the history of missed proofs of a **SP**
- Triggering the Slot Recovery Mechanism when an **SP** reaches the maximum allowed number of missed proofs

They may also exhibit the following adversarial behavior, whether for profit driven, malicious, or censorship motivations:

- Colluding with SPs to ignore missed proofs
- Observing a missed proof but do not post it onchain

## Incentive Mechanisms

The following mechanisms help incentivize the expected behavior of each role and mitigate the detrimental ones.

### Clients Provide Full Payment Upfront

Clients must deposit the full amount in *CDX (Testnet token)* that covers the entirety of the storage contract duration upfront. This indicates their pledge to pay a certain amount for the storage contract, though the contract only begins when and if all data slots are filled by Storage Providers.

### Delayed Payment to Storage Providers

Storage Providers only receive payment related to the provision of services at the end of the contract duration.

### Collateral Requirement

In order to fill a data slot, Storage Providers first stake and commit the required collateral in the form of the *CDX  (Testnet token)* for that slot which is then subject to slashing if they do not post a proof to confirm the slot.

Validators also need to post collateral to participate in the validation service.

### Proof of Storage

Contracts only start when all data slots are filled. Slots are only considered filled after a Storage Provider has posted collateral and the associated proof for its slot.

Once the contract begins, Storage Providers regularly provide proof of storage.

### **Slashing for Missed Proofs of Storage**

At any point during the duration of the storage contract, the storage provider is slashed if it fails to provide a certain number of proof of storage in a row. Should the SP resume providing proof of storage, it needs to top up the slashed collateral. The penalty is a fixed percentage of the total collateral.

### Slot Recovery Mechanism

If a Storage Provider does not submit the required storage proofs when required, after a number of slashings their entire collateral will be seized. A portion of the confiscated collateral is used as an incentive for the new Storage Provider who recovers and starts serving the abandoned slot. The remainder of the confiscated collateral in *CDX (Testnet token)* is burned.

### Slashing Defaulted Contract

If, at any point during the duration of the storage contract, the number of data slots currently abandoned (and not yet recovered) reaches or surpasses the maximum allowable lost slots (meaning the data becomes irretrievable), then the entire storage contract is deemed to be *failed*.

At this stage, collaterals of all Storage Providers serving data slots in the contract are entirely slashed.

### Client Reimbursement

If at any point during the contract, sufficient slots are abandoned such that the data is not fully recoverable, Clients receive back any leftover from their original payment.

## Token Lifecycle

### Burning

*CDX (Testnet token)* tokens are burned in these instances:

- When a storage deal contract fails to initiate, a small portion of the Client's payment for the storage deal is burned. This serves primarily as a mechanism to deter spam and ensure that deal requests are submitted at market-appropriate prices for storage.
- When a storage deal contract successfully initiates, the protocol applies a fee for facilitating the transaction.
- Whenever a Storage Provider misses a certain number of storage proofs, a portion of the collateral is slashed and burned.
- Once the slot recovery mechanism resolves, the remaining of the abandoning Storage Provider’s collateral is burned.
