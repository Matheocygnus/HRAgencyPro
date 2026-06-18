# Skill Registry — hr-agency-pro-front

Generated: 2026-06-09
Project: hr-agency-pro-front (engram key: hragencypro)

## Skills Index

| Name | Trigger / Description | Scope | Path |
|------|----------------------|-------|------|
| judgment-day | judgment day, dual review, adversarial review, juzgar — Run blind dual review, fix confirmed issues, then re-judge | user | `~/.claude/skills/judgment-day/SKILL.md` |
| branch-pr | creating, opening, or preparing PRs for review — Create pull requests with issue-first checks | user | `~/.claude/skills/branch-pr/SKILL.md` |
| chained-pr | PRs over 400 lines, stacked PRs, review slices — Split oversized changes into chained PRs | user | `~/.claude/skills/chained-pr/SKILL.md` |
| work-unit-commits | implementation, commit splitting, chained PRs, keeping tests and docs with code — Plan commits as reviewable work units | user | `~/.claude/skills/work-unit-commits/SKILL.md` |
| issue-creation | creating GitHub issues, bug reports, or feature requests | user | `~/.claude/skills/issue-creation/SKILL.md` |
| comment-writer | PR feedback, issue replies, reviews, Slack messages, GitHub comments | user | `~/.claude/skills/comment-writer/SKILL.md` |
| cognitive-doc-design | writing guides, READMEs, RFCs, onboarding, architecture, or review-facing docs | user | `~/.claude/skills/cognitive-doc-design/SKILL.md` |
| project-manifest | bootstrap new project, project manifest, "manifiesto", "bootstrap proyecto" | user | `~/.claude/skills/project-manifest/SKILL.md` |
| project-architect | technical architecture design, "arquitectura técnica", "project architect" | user | `~/.claude/skills/project-architect/SKILL.md` |
| project-inception | complete project inception, manifest + architect + roadmap, "project inception" | user | `~/.claude/skills/project-inception/SKILL.md` |
| skill-creator | new skills, agent instructions, documenting AI usage patterns | user | `~/.claude/skills/skill-creator/SKILL.md` |
| skill-improver | improve skills, audit skills, refactor skills, skill quality | user | `~/.claude/skills/skill-improver/SKILL.md` |
| go-testing | Go tests, go test coverage, Bubbletea teatest, golden files | user | `~/.claude/skills/go-testing/SKILL.md` |

## SDD Phase Skills (system — resolved by orchestrator)

| Phase | Path |
|-------|------|
| sdd-init | `~/.claude/skills/sdd-init/SKILL.md` |
| sdd-explore | `~/.claude/skills/sdd-explore/SKILL.md` |
| sdd-propose | `~/.claude/skills/sdd-propose/SKILL.md` |
| sdd-spec | `~/.claude/skills/sdd-spec/SKILL.md` |
| sdd-design | `~/.claude/skills/sdd-design/SKILL.md` |
| sdd-tasks | `~/.claude/skills/sdd-tasks/SKILL.md` |
| sdd-apply | `~/.claude/skills/sdd-apply/SKILL.md` |
| sdd-verify | `~/.claude/skills/sdd-verify/SKILL.md` |
| sdd-archive | `~/.claude/skills/sdd-archive/SKILL.md` |
| sdd-onboard | `~/.claude/skills/sdd-onboard/SKILL.md` |

## Shared Conventions

- `~/.claude/skills/_shared/engram-convention.md`
- `~/.claude/skills/_shared/openspec-convention.md`
- `~/.claude/skills/_shared/persistence-contract.md`
- `~/.claude/skills/_shared/sdd-phase-common.md`
- `~/.claude/skills/_shared/skill-resolver.md`
- `~/.claude/skills/_shared/sdd-status-contract.md`

## Notes

- No project-level skills or convention files found (blank canvas project).
- go-testing skill is registered but not applicable to this React/TypeScript project.
- chained-pr and work-unit-commits are relevant for sdd-apply given the 400-line budget rule.
