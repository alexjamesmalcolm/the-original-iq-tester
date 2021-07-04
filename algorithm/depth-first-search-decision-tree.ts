import uniqueIdGenerator from "./unique-id-generator.ts";

interface D<DecisionData> {
  id: string;
  p?: D<DecisionData>;
  d: DecisionData;
}

export function* depthFirstSearchDecisionTree<DecisionData>({
  areBranchesEquivalent,
  getNextLegalDecisions,
  isBranchFinished,
}: {
  getNextLegalDecisions: (decisions: DecisionData[]) => DecisionData[];
  areBranchesEquivalent?: (
    first: DecisionData[],
    second: DecisionData[]
  ) => boolean;
  isBranchFinished: (decisions: DecisionData[]) => boolean;
}) {
  type Decision = D<DecisionData>;
  const getBranchDecisionData = (decision: Decision): DecisionData[] => {
    if (decision.p) {
      return [...getBranchDecisionData(decision.p), decision.d];
    } else {
      return [decision.d];
    }
  };
  const decisionQueue: Decision[] = getNextLegalDecisions([]).map(
    (decisionData): Decision => ({ d: decisionData, id: uniqueIdGenerator() })
  );
  const finishedBranches: DecisionData[][] = [];
  while (decisionQueue.length > 0) {
    // Grab the latest decision off of the queue
    const latestDecision = decisionQueue.pop();
    if (!latestDecision) return;

    // Get its branch
    const branch = getBranchDecisionData(latestDecision);
    const isBranchDuplicate = (): boolean => {
      if (!areBranchesEquivalent) return false;
      return finishedBranches.some((finishedBranch) =>
        areBranchesEquivalent(finishedBranch, branch)
      );
    };
    if (isBranchFinished(branch) && !isBranchDuplicate()) {
      finishedBranches.push(branch);
      yield branch;
    } else {
      getNextLegalDecisions(branch).forEach((decisionData) => {
        decisionQueue.push({
          id: uniqueIdGenerator(),
          d: decisionData,
          p: latestDecision,
        });
      });
    }
  }
}
