import React from 'react'
import styled from 'styled-components'
import {
  MatchmakingDivision,
  matchmakingDivisionToLabel,
  ratingToMatchmakingDivision,
} from '../../common/matchmaking'
import { makePublicAssetUrl } from '../network/server-url'
import { singleLine } from '../styles/typography'

export interface RankIconProps {
  rating: number
  rank: number
  className?: string
  showChampionRank?: boolean
}

const Container = styled.div`
  position: relative;
  width: 88px;
  height: 88px;
`

const StyledImage = styled.img`
  width: 100%;
  height: auto;
`

// NOTE(tec27): We use an SVG here to get the text to scale based on the container width. This would
// be more easily doable with `vi` or `vb` units but alas, not supported by Chrome yet :(
const RankContainer = styled.svg`
  position: absolute;
  width: 100%;
  left: 0;
  bottom: 0;
`

const RankText = styled.div`
  ${singleLine};
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.87);
`

export function RankIcon({ rating, rank, className, showChampionRank = true }: RankIconProps) {
  const division = ratingToMatchmakingDivision(rating, rank)
  const iconUrl = makePublicAssetUrl(`images/ranks/${encodeURIComponent(division)}.svg`)
  const divisionLabel = matchmakingDivisionToLabel(division)

  return (
    <Container className={className}>
      <StyledImage src={iconUrl} alt={divisionLabel} />
      {showChampionRank && division === MatchmakingDivision.Champion ? (
        <RankContainer viewBox='0 0 88 88' xmlns='http://www.w3.org/2000/svg'>
          <foreignObject x='0' y='60' width='88' height='24'>
            <RankText>{rank}</RankText>
          </foreignObject>
        </RankContainer>
      ) : null}
    </Container>
  )
}

export interface UnrankedIconProps {
  className?: string
}

export function UnrankedIcon({ className }: UnrankedIconProps) {
  const iconUrl = makePublicAssetUrl('images/ranks/unranked.svg')
  const divisionLabel = matchmakingDivisionToLabel(MatchmakingDivision.Unranked)

  return (
    <Container className={className}>
      <StyledImage src={iconUrl} alt={divisionLabel} />
    </Container>
  )
}